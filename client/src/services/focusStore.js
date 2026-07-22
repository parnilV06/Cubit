import { create } from 'zustand';
import { focusAPI } from './api';

// Create persistent native HTMLAudioElement instance outside React lifecycle
const audio = new Audio();
audio.preload = 'metadata';
audio.loop = true; // Ambient focus audio defaults to looping

// Default catalog fallback for development or when remote backend is not yet updated
const FALLBACK_FOCUS_TRACKS = [
  {
    id: 'nexsus-waves',
    title: 'Nexsus Waves',
    category: 'Deep Focus Synth',
    duration: 240,
    audioUrl: 'https://res.cloudinary.com/dhqrxdeav/video/upload/v1784741859/Cubit_-_Nexsus_Waves_byhqwk.mp3',
    coverArt: null
  },
  {
    id: 'midnight-focus-night-mix',
    title: 'Midnight Focus (Night Mix)',
    category: 'Ambient Focus',
    duration: 180,
    audioUrl: 'https://res.cloudinary.com/dhqrxdeav/video/upload/v1784741858/Cubit_-_Midnight_Focus_xtfgh1.mp3',
    coverArt: null
  },
  {
    id: 'midnight-focus',
    title: 'Midnight Focus',
    category: 'Deep Focus',
    duration: 210,
    audioUrl: 'https://res.cloudinary.com/dhqrxdeav/video/upload/v1784740616/Cubit_-_Midnight_Focus_yqocgx.mp3',
    coverArt: null
  },
  {
    id: 'cozy-focus',
    title: 'Cozy Focus',
    category: 'Chilled Ambient',
    duration: 195,
    audioUrl: 'https://res.cloudinary.com/dhqrxdeav/video/upload/v1784740616/Cubit_-_Cozy_Focus_u7gsob.mp3',
    coverArt: null
  }
];

export const useFocusStore = create((set, get) => {
  // Initialize audio event listeners
  audio.addEventListener('timeupdate', () => {
    set({ currentTime: audio.currentTime });
  });

  audio.addEventListener('loadedmetadata', () => {
    if (!isNaN(audio.duration)) {
      set({ duration: audio.duration, audioError: null });
    }
  });

  audio.addEventListener('playing', () => {
    set({ isPlaying: true, audioError: null });
  });

  audio.addEventListener('pause', () => {
    set({ isPlaying: false });
  });

  audio.addEventListener('ended', () => {
    if (!audio.loop) {
      set({ isPlaying: false, currentTime: 0 });
    }
  });

  audio.addEventListener('error', (e) => {
    console.error('Audio playback error:', e);
    set({
      isPlaying: false,
      audioError: 'Unable to play track. Please check network or try another track.'
    });
  });

  return {
    tracks: [],
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    isLooping: true,
    loading: false,
    audioError: null,

    fetchTracks: async () => {
      if (get().tracks.length > 0) return; // Catalog already loaded
      set({ loading: true, audioError: null });
      try {
        const response = await focusAPI.getTracks();
        const apiTracks = response.data?.tracks || response.tracks || [];
        const tracks = apiTracks.length > 0 ? apiTracks : FALLBACK_FOCUS_TRACKS;
        set({ tracks, loading: false });

        // Set initial track if none selected yet
        if (tracks.length > 0 && !get().currentTrack) {
          const firstTrack = tracks[0];
          set({ currentTrack: firstTrack, duration: firstTrack.duration || 0 });
          audio.src = firstTrack.audioUrl;
        }
      } catch (error) {
        console.warn('Backend focus tracks API returned error, using fallback catalog:', error.message);
        // Fallback gracefully to static catalog so app works even if remote server is not deployed
        const tracks = FALLBACK_FOCUS_TRACKS;
        set({ tracks, loading: false, audioError: null });

        if (tracks.length > 0 && !get().currentTrack) {
          const firstTrack = tracks[0];
          set({ currentTrack: firstTrack, duration: firstTrack.duration || 0 });
          audio.src = firstTrack.audioUrl;
        }
      }
    },

    selectTrack: (trackId) => {
      const { tracks, currentTrack, isPlaying } = get();
      const selected = tracks.find((t) => t.id === trackId);
      if (!selected || selected.id === currentTrack?.id) return;

      const wasPlaying = isPlaying;
      audio.pause();

      audio.src = selected.audioUrl;
      audio.currentTime = 0;
      set({
        currentTrack: selected,
        currentTime: 0,
        duration: selected.duration || 0,
        audioError: null
      });

      if (wasPlaying) {
        audio.play().catch((err) => {
          console.error('Autoplay after track switch failed:', err);
          set({ isPlaying: false, audioError: 'Playback blocked or failed.' });
        });
      }
    },

    togglePlay: () => {
      const { currentTrack, isPlaying, tracks } = get();

      // Fallback to first track if none selected yet
      if (!currentTrack && tracks.length > 0) {
        get().selectTrack(tracks[0].id);
      }

      if (audio.paused) {
        if (!audio.src && currentTrack) {
          audio.src = currentTrack.audioUrl;
        }
        audio.play().then(() => {
          set({ isPlaying: true, audioError: null });
        }).catch((err) => {
          console.error('Play request failed:', err);
          set({ isPlaying: false, audioError: 'Click play to start audio.' });
        });
      } else {
        audio.pause();
        set({ isPlaying: false });
      }
    },

    play: () => {
      if (audio.paused) {
        audio.play().then(() => {
          set({ isPlaying: true, audioError: null });
        }).catch((err) => {
          console.error('Play request failed:', err);
          set({ isPlaying: false });
        });
      }
    },

    pause: () => {
      if (!audio.paused) {
        audio.pause();
        set({ isPlaying: false });
      }
    },

    seek: (timeSeconds) => {
      if (!isNaN(timeSeconds)) {
        const clamped = Math.max(0, Math.min(timeSeconds, audio.duration || get().duration || 0));
        audio.currentTime = clamped;
        set({ currentTime: clamped });
      }
    },

    setVolume: (newVolume) => {
      const clamped = Math.max(0, Math.min(1, newVolume));
      audio.volume = clamped;
      audio.muted = clamped === 0;
      set({ volume: clamped, isMuted: clamped === 0 });
    },

    toggleMute: () => {
      const nextMute = !get().isMuted;
      audio.muted = nextMute;
      set({ isMuted: nextMute });
    },

    toggleLoop: () => {
      const nextLoop = !get().isLooping;
      audio.loop = nextLoop;
      set({ isLooping: nextLoop });
    }
  };
});
