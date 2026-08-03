import { create } from 'zustand';
import { authAPI, sessionAPI, solveAPI, noteAPI } from './api';
import { createActiveScramble } from './scramble/index';

export const useStore = create((set, get) => ({
  // Auth State
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loadingUser: false,
  authError: null,

  // Session, Solve & Scramble State
  selectedSessionId: localStorage.getItem('selectedSessionId') || null,
  sessions: [],
  activeSession: null,
  activeScramble: null,
  solves: [],
  loadingSolves: false,
  notes: [],
  loadingNotes: false,

  // Auth Actions
  login: async (email, password) => {
    set({ loadingUser: true, authError: null });
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, loadingUser: false });
      await get().fetchActiveSession();
    } catch (error) {
      set({ authError: error.message, loadingUser: false });
      throw error;
    }
  },

  loginWithGoogle: async (credential) => {
    set({ loadingUser: true, authError: null });
    try {
      const response = await authAPI.loginWithGoogle(credential);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, loadingUser: false });
      await get().fetchActiveSession();
    } catch (error) {
      set({ authError: error.message, loadingUser: false });
      throw error;
    }
  },

  register: async (displayName, username, email, password) => {
    set({ loadingUser: true, authError: null });
    try {
      await authAPI.register(displayName, username, email, password);
      const loginResponse = await authAPI.login(email, password);
      const { token, user } = loginResponse.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, loadingUser: false });
      await get().fetchActiveSession();
    } catch (error) {
      set({ authError: error.message, loadingUser: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedSessionId');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      selectedSessionId: null,
      activeSession: null,
      activeScramble: null,
      solves: [],
      sessions: [],
      notes: [],
    });
  },

  fetchMe: async () => {
    if (!localStorage.getItem('token')) return;
    set({ loadingUser: true });
    try {
      const response = await authAPI.getMe();
      set({ user: response.data.user, isAuthenticated: true, loadingUser: false });
      await get().fetchActiveSession();
    } catch (error) {
      get().logout();
      set({ loadingUser: false });
    }
  },

  // Active Scramble Action
  generateNewScramble: () => {
    const { activeSession } = get();
    const puzzleType = activeSession?.puzzleType || 'THREE_BY_THREE';
    try {
      const activeScramble = createActiveScramble(puzzleType);
      set({ activeScramble });
      return activeScramble;
    } catch (error) {
      console.error('Failed to generate active scramble:', error);
    }
  },

  // Sessions Actions
  fetchSessions: async () => {
    try {
      const response = await sessionAPI.getSessions();
      const fetchedSessions = response.data.sessions || [];
      set({ sessions: fetchedSessions });

      const currentSelectedId = get().selectedSessionId || localStorage.getItem('selectedSessionId');
      let validSession = fetchedSessions.find(s => s.id === currentSelectedId);

      if (!validSession && fetchedSessions.length > 0) {
        validSession = fetchedSessions[0];
      }

      if (validSession) {
        const idChanged = get().selectedSessionId !== validSession.id;
        localStorage.setItem('selectedSessionId', validSession.id);
        set({ selectedSessionId: validSession.id, activeSession: validSession });

        if (idChanged || get().solves.length === 0) {
          await get().fetchSolves(validSession.id);
          await get().fetchNotes(validSession.id);
          get().generateNewScramble();
        }
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  },

  fetchActiveSession: async () => {
    try {
      const response = await sessionAPI.getSessions();
      const fetchedSessions = response.data.sessions || [];
      set({ sessions: fetchedSessions });

      const persistedId = localStorage.getItem('selectedSessionId') || get().selectedSessionId;
      let targetSession = fetchedSessions.find(s => s.id === persistedId);

      if (!targetSession) {
        const currentRes = await sessionAPI.getCurrentSession().catch(() => null);
        const serverSession = currentRes?.data?.session;
        if (serverSession) {
          targetSession = fetchedSessions.find(s => s.id === serverSession.id) || serverSession;
        } else if (fetchedSessions.length > 0) {
          targetSession = fetchedSessions[0];
        }
      }

      if (targetSession) {
        localStorage.setItem('selectedSessionId', targetSession.id);
        set({ selectedSessionId: targetSession.id, activeSession: targetSession });
        await get().fetchSolves(targetSession.id);
        await get().fetchNotes(targetSession.id);
        get().generateNewScramble();
      }
    } catch (error) {
      console.error('Failed to fetch/sync active session:', error);
    }
  },

  createSession: async (name, puzzleType) => {
    try {
      const response = await sessionAPI.createSession(name, puzzleType);
      const newSession = response.data.session;
      
      localStorage.setItem('selectedSessionId', newSession.id);
      set(state => ({
        selectedSessionId: newSession.id,
        activeSession: newSession,
        sessions: [newSession, ...state.sessions.filter(s => s.id !== newSession.id)],
      }));

      await get().fetchSolves(newSession.id);
      await get().fetchNotes(newSession.id);
      get().generateNewScramble();
      await get().fetchSessions();
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  },

  renameSession: async (sessionId, newName) => {
    try {
      const response = await sessionAPI.renameSession(sessionId, newName);
      const updatedSession = response.data?.session || response.session;
      set(state => ({
        activeSession: state.activeSession?.id === sessionId ? updatedSession : state.activeSession,
      }));
      await get().fetchSessions();
    } catch (error) {
      console.error('Failed to rename session:', error);
      throw error;
    }
  },

  deleteSession: async (sessionId) => {
    const { sessions, selectedSessionId, selectSession } = get();
    try {
      // 1. Determine deterministic fallback if deleting the selected session
      let fallbackId = null;
      if (selectedSessionId === sessionId) {
        const sortedChronological = [...sessions].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        const currentIndex = sortedChronological.findIndex((s) => s.id === sessionId);
        if (currentIndex > 0) {
          fallbackId = sortedChronological[currentIndex - 1].id;
        } else if (sortedChronological.length > 1) {
          fallbackId = sortedChronological[1].id;
        }
      }

      // 2. Delete session on backend
      await sessionAPI.deleteSession(sessionId);

      // 3. Fetch updated sessions list from backend
      const response = await sessionAPI.getSessions();
      const updatedSessions = response.data.sessions || [];
      set({ sessions: updatedSessions });

      // 4. Switch to fallback or first available session if selected session was deleted
      if (selectedSessionId === sessionId && updatedSessions.length > 0) {
        const targetId = (fallbackId && updatedSessions.some(s => s.id === fallbackId))
          ? fallbackId
          : updatedSessions[0].id;
        await selectSession(targetId);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      throw error;
    }
  },

  selectSession: async (sessionId) => {
    const session = get().sessions.find(s => s.id === sessionId);
    if (session) {
      localStorage.setItem('selectedSessionId', sessionId);
      set({ selectedSessionId: sessionId, activeSession: session });
      await get().fetchSolves(sessionId);
      await get().fetchNotes(sessionId);
      get().generateNewScramble();
    }
  },

  // Solves Actions (DATA OPERATIONS — KEEP SELECTED SESSION PERSISTENT)
  fetchSolves: async (sessionId) => {
    set({ loadingSolves: true });
    try {
      const response = await solveAPI.getSolves(sessionId);
      const mappedSolves = (response.data.solves || []).map(solve => ({
        ...solve,
        time: solve.time / 1000,
      }));
      set({ solves: mappedSolves, loadingSolves: false });
    } catch (error) {
      set({ loadingSolves: false });
      console.error('Failed to fetch solves:', error);
    }
  },

  addSolve: async (timeSeconds, scramble) => {
    const { activeSession } = get();
    if (!activeSession) return;
    try {
      const timeMs = Math.round(timeSeconds * 1000);
      const response = await solveAPI.addSolve(activeSession.id, timeMs, scramble);
      const backendSolve = response.data.solve;
      const newSolve = {
        ...backendSolve,
        time: backendSolve.time / 1000,
      };
      set(state => ({
        solves: [newSolve, ...state.solves],
      }));
      get().generateNewScramble();

      // Refresh session metadata without switching selected session
      const sessResponse = await sessionAPI.getSessions();
      set({ sessions: sessResponse.data.sessions || [] });
    } catch (error) {
      console.error('Failed to record solve:', error);
      throw error;
    }
  },

  updateSolve: async (id, penalty) => {
    try {
      const response = await solveAPI.updateSolve(id, penalty);
      const backendSolve = response.data.solve;
      const updatedSolve = {
        ...backendSolve,
        time: backendSolve.time / 1000,
      };
      set(state => ({
        solves: state.solves.map(s => s.id === id ? updatedSolve : s),
      }));
      const sessResponse = await sessionAPI.getSessions();
      set({ sessions: sessResponse.data.sessions || [] });
    } catch (error) {
      console.error('Failed to update solve penalty:', error);
      throw error;
    }
  },

  deleteSolve: async (id) => {
    try {
      await solveAPI.deleteSolve(id);
      set(state => ({
        solves: state.solves.filter(s => s.id !== id),
      }));
      const sessResponse = await sessionAPI.getSessions();
      set({ sessions: sessResponse.data.sessions || [] });
    } catch (error) {
      console.error('Failed to delete solve:', error);
      throw error;
    }
  },

  // Notes Actions
  fetchNotes: async (sessionId) => {
    set({ loadingNotes: true });
    try {
      const response = await noteAPI.getNotes(sessionId);
      set({ notes: response.data.notes || [], loadingNotes: false });
    } catch (error) {
      set({ loadingNotes: false });
      console.error('Failed to fetch notes:', error);
    }
  },

  addNote: async (content) => {
    const { activeSession } = get();
    if (!activeSession) return;
    try {
      const response = await noteAPI.createNote(activeSession.id, content);
      const newNote = response.data.note;
      set(state => ({
        notes: [newNote, ...state.notes],
      }));
    } catch (error) {
      console.error('Failed to add note:', error);
      throw error;
    }
  },

  deleteNoteAction: async (id) => {
    try {
      await noteAPI.deleteNote(id);
      set(state => ({
        notes: state.notes.filter(n => n.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  },
}));
