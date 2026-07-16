// create an express app for the server to import the file into server.js and setup the server
const express = require('express');
const app = express();  

const parseAllowedOrigins = () => {
  const origins = [
    process.env.CLIENT_ORIGIN,
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];
  const set = new Set();
  origins.forEach(item => {
    if (item) {
      item.split(',').forEach(o => {
        const trimmed = o.trim();
        if (trimmed) {
          set.add(trimmed);
          set.add(trimmed.replace(/\/$/, ''));
        }
      });
    }
  });
  return set;
};

const allowedOrigins = parseAllowedOrigins();

const isOriginAllowed = (origin) => {
  if (!origin) return false;
  const cleanOrigin = origin.replace(/\/$/, '');
  if (allowedOrigins.has(cleanOrigin)) {
    return true;
  }
  // Allow all Vercel deployments starting with cubit-
  if (cleanOrigin.startsWith('https://cubit-') && cleanOrigin.endsWith('.vercel.app')) {
    return true;
  }
  return false;
};

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin) {
    if (isOriginAllowed(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    } else {
      console.warn(`[CORS Blocked] Origin "${origin}" is not allowed. Allowed list:`, Array.from(allowedOrigins));
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

// middleware to parse JSON bodies
app.use(express.json());

module.exports = app;
