const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const leadsRoutes = require('./routes/leads');
const contentRoutes = require('./routes/content');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://projectready4u-44.vercel.app',
  'https://projectready4u.vercel.app',
  'https://projectready4u-44.vercel.app',
  'https://your-backend-url.onrender.com',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. curl or server-to-server)
    if (!origin) return callback(null, true);

    // Allow localhost for development
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }

    // Allow any configured origin
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow everything in case we meant to pass preview server/other domain
    // but for safety, keep whitelist.
    return callback(new Error(`CORS policy does not allow access from Origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/content', contentRoutes);

app.get('/', (req, res) => {
  res.send({ message: 'ProjectReady4U backend is running.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
