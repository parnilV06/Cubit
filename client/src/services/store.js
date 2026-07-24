import { create } from 'zustand';
import { authAPI, sessionAPI, solveAPI, noteAPI } from './api';

export const useStore = create((set, get) => ({
  // Auth State
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loadingUser: false,
  authError: null,

  // Session & Solve State
  sessions: [],
  activeSession: null,
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
      // Fetch active session immediately after login
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
      // Fetch active session immediately after login
      await get().fetchActiveSession();
    } catch (error) {
      set({ authError: error.message, loadingUser: false });
      throw error;
    }
  },

  register: async (displayName, username, email, password) => {
    set({ loadingUser: true, authError: null });
    try {
      const response = await authAPI.register(displayName, username, email, password);
      // Automatically log in after registration
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
    set({ user: null, token: null, isAuthenticated: false, activeSession: null, solves: [], sessions: [] });
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

  // Sessions Actions
  fetchSessions: async () => {
    try {
      const response = await sessionAPI.getSessions();
      set({ sessions: response.data.sessions || [] });
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  },

  fetchActiveSession: async () => {
    try {
      const response = await sessionAPI.getCurrentSession();
      const activeSession = response.data.session;
      set({ activeSession });
      if (activeSession) {
        await get().fetchSolves(activeSession.id);
        await get().fetchNotes(activeSession.id);
      }
      await get().fetchSessions();
    } catch (error) {
      console.error('Failed to fetch current session:', error);
    }
  },

  createSession: async (name, puzzleType) => {
    try {
      const response = await sessionAPI.createSession(name, puzzleType);
      const newSession = response.data.session;
      set({ activeSession: newSession });
      await get().fetchSolves(newSession.id);
      await get().fetchNotes(newSession.id);
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

  selectSession: async (sessionId) => {
    const session = get().sessions.find(s => s.id === sessionId);
    if (session) {
      set({ activeSession: session });
      await get().fetchSolves(sessionId);
      await get().fetchNotes(sessionId);
    }
  },

  // Solves Actions
  fetchSolves: async (sessionId) => {
    set({ loadingSolves: true });
    try {
      const response = await solveAPI.getSolves(sessionId);
      // Map solves times from milliseconds (integer) to decimal seconds (float)
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
      // Refresh session count/averages in sidebar list
      await get().fetchActiveSession();
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
      await get().fetchActiveSession();
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
      await get().fetchActiveSession();
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
