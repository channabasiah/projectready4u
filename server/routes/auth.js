const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabaseClient');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // First, try to find admin in database
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();

    if (!error && admin) {
      // Admin found in DB, check password
      const passwordMatches = await bcrypt.compare(password, admin.password_hash);
      if (!passwordMatches) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.json({ token, user: { id: admin.id, username: admin.username } });
    }

    // If not in DB, fallback to env vars for initial setup
    const envUsername = process.env.ADMIN_USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD;
    if (username === envUsername && password === envPassword) {
      // Create admin in DB for future logins
      const hashedPassword = await bcrypt.hash(password, 10);
      const { data: newAdmin, error: insertError } = await supabase
        .from('admins')
        .insert([{ username, password_hash: hashedPassword }])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating admin:', insertError);
        return res.status(500).json({ message: 'Error setting up admin.' });
      }

      const token = jwt.sign({ id: newAdmin.id, username: newAdmin.username }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.json({ token, user: { id: newAdmin.id, username: newAdmin.username } });
    }

    return res.status(401).json({ message: 'Invalid credentials.' });
  } catch (err) {
    console.error('Auth login error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
