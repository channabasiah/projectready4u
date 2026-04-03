const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const leadsRoutes = require('./routes/leads');
const contentRoutes = require('./routes/content');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow localhost origins for development
    if (origin.startsWith('http://localhost:')) return callback(null, true);

    // Allow production origin
    if (origin === 'https://projectready4u.vercel.app') return callback(null, true);

    // Reject other origins
    return callback(new Error('Not allowed by CORS'));
  }
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
