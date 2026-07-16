import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (displayName, username, email, password) =>
    api.post('/auth/register', { displayName, username, email, password }),
  getMe: () => api.get('/auth/me'),
};

export const profileAPI = {
  getProfile: (username) => api.get(`/profile/${username}`),
  updateProfile: (displayName, bio) => api.patch('/profile', { displayName, bio }),
  uploadAvatar: (formData) =>
    api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export const sessionAPI = {
  getSessions: () => api.get('/sessions'),
  getCurrentSession: () => api.get('/sessions/current'),
  createSession: (name, puzzleType) => api.post('/sessions', { name, puzzleType }),
  renameSession: (id, name) => api.patch(`/sessions/${id}`, { name }),
  archiveSession: (id) => api.patch(`/sessions/${id}/archive`),
  deleteSession: (id) => api.delete(`/sessions/${id}`),
};

export const solveAPI = {
  getSolves: (sessionId) => api.get(`/solves/session/${sessionId}`),
  addSolve: (sessionId, time, scramble, penalty = 'NONE') =>
    api.post('/solves', { sessionId, time, scramble, penalty }),
  updateSolve: (id, penalty) => api.patch(`/solves/${id}`, { penalty }),
  deleteSolve: (id) => api.delete(`/solves/${id}`),
};

export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),
};

export const trainerAPI = {
  getLessons: () => api.get('/trainer/lessons'),
  getLesson: (slug) => api.get(`/trainer/lessons/${slug}`),
  completeLesson: (slug) => api.post(`/trainer/lessons/${slug}/complete`),
  getProgress: () => api.get('/trainer/progress'),
};

export const communityAPI = {
  getPosts: (feed = 'global', type = '') => {
    let url = `/community/posts?feed=${feed}`;
    if (type) url += `&type=${type}`;
    return api.get(url);
  },
  createPost: (formData) =>
    api.post('/community/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  likePost: (id) => api.post(`/community/posts/${id}/like`),
  unlikePost: (id) => api.delete(`/community/posts/${id}/like`),
  addComment: (postId, content) => api.post(`/community/posts/${postId}/comments`, { content }),
  deleteComment: (commentId) => api.delete(`/community/comments/${commentId}`),
};

export const friendAPI = {
  getFriends: () => api.get('/friends'),
  getRequests: () => api.get('/friends/requests'),
  sendRequest: (username) => api.post('/friends/request', { username }),
  acceptRequest: (requestId) => api.patch(`/friends/request/${requestId}/accept`),
  rejectRequest: (requestId) => api.patch(`/friends/request/${requestId}/reject`),
  removeFriend: (id) => api.delete(`/friends/${id}`),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export default api;
