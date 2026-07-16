import { io } from 'socket.io-client';

let socket = null;

export const initiateSocketConnection = (token) => {
  if (socket) return socket;

  // Use base backend url without /api
  const backendUrl = 'http://localhost:5000';
  
  socket = io(backendUrl, {
    auth: {
      token
    },
    transports: ['websocket', 'polling']
  });

  console.log('Connecting to Socket.io...');
  
  socket.on('connect', () => {
    console.log('Socket.io connected successfully!');
  });

  socket.on('connect_error', (err) => {
    console.error('Socket.io connection error:', err);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
