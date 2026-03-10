require('dotenv').config();

const express = require('express');
const cors = require('cors');
const createSessionMiddleware = require('./middleware/session');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS — allow frontend origin with credentials
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

// Session middleware
app.use(createSessionMiddleware());

// Routes
app.use('/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`   Frontend URL: ${FRONTEND_URL}`);
});
