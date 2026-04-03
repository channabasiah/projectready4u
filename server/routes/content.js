const express = require('express');
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const fallbackContent = {
  hero_title: 'Join ProjectReady4U - Your Career Starts Here',
  hero_subtitle: 'Submit your details and our team will connect with you soon.',
  cta_text: 'Register Your Interest',
  what_included_title: 'What You Get with ProjectReady4U',
  what_included_text:
    '• Career readiness guidance\n• Resume and portfolio support\n• Interview coaching & mock tests\n• Network with mentors & employers\n• Scholarship and internship connection',
  contact_phone: '+1234567890',
  contact_email: 'hello@projectready4u.com',
  contact_whatsapp: '1234567890',
  footer_text: '© 2026 ProjectReady4U. All rights reserved.',
};

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('site_content').select('*');
    if (error || !data) {
      console.error('Fetch content error', error);
      return res.json({ content: fallbackContent });
    }

    const content = {};
    if (data && Array.isArray(data)) {
      data.forEach((row) => {
        content[row.key] = row.value;
      });
    }

    return res.json({ content: Object.keys(content).length ? content : fallbackContent });
  } catch (err) {
    console.error('Content GET error', err);
    return res.json({ content: fallbackContent });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || value == null) {
      return res.status(400).json({ message: 'Key and value are required.' });
    }

    const { error } = await supabase.from('site_content').upsert({ key, value });
    if (error) {
      console.error('Upsert content error', error);
      return res.status(500).json({ message: 'Failed to update content' });
    }

    return res.json({ message: 'Content updated successfully' });
  } catch (err) {
    console.error('Content PUT error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
