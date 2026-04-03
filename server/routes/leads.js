const express = require('express');
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, phone, whatsapp, email, college, city, project_title } = req.body;
    if (!name || !phone || !whatsapp || !email || !college || !city) {
      return res.status(400).json({ message: 'Name, phone, whatsapp, email, college and city are required.' });
    }

    let studentCode = null;
    try {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const dateKey = `${yyyy}${mm}${dd}`;

      const countRes = await supabase
        .from('students')
        .select('student_code', { head: true, count: 'exact' })
        .like('student_code', `${dateKey}-%`);

      if (!countRes.error && typeof countRes.count === 'number') {
        studentCode = `${dateKey}-${String(countRes.count + 1).padStart(3, '0')}`;
      }
    } catch (err) {
      console.warn('Student code generation failed, skipping:', err.message);
    }

    const newLead = {
      name,
      phone,
      whatsapp,
      email,
      college,
      city,
    };

    if (project_title) newLead.project_title = project_title;
    if (studentCode) newLead.student_code = studentCode;

    const { data, error } = await supabase.from('students').insert([newLead]);
    console.log('Insert attempt:', newLead);
    console.log('Insert result - data:', data, 'error:', error);

    if (error) {
      console.error('Insert lead error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      const status = error?.status || 502;
      return res.status(status === 0 ? 502 : status).json({
        message: 'Failed to submit lead',
        error: error?.message || 'Supabase insert error',
        details: error,
      });
    }

    if (!data || data.length === 0) {
      console.log('Insert succeeded but no data returned - this is normal with RLS');
      return res.json({ message: 'Lead submitted successfully', lead: newLead });
    }

    return res.json({ message: 'Lead submitted successfully', lead: data[0] });
  } catch (err) {
    console.error('Leads POST error', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

router.put('/:id/reached', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { reached } = req.body;

    if (typeof reached !== 'boolean') {
      return res.status(400).json({ message: 'Reached must be boolean.' });
    }

    const { data, error } = await supabase
      .from('students')
      .update({ reached })
      .eq('id', id)
      .single();

    if (error) {
      console.error('Update reached error', error);
      return res.status(500).json({ message: 'Failed to update reached status' });
    }

    return res.json({ message: 'Reached status updated', lead: data });
  } catch (err) {
    console.error('Leads reached PUT error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) {
      console.error('Delete student error', error);
      return res.status(500).json({ message: 'Failed to delete student' });
    }

    return res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Leads delete error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Fetch leads error', error);
      // fallback: return empty list instead of hard 500 to avoid breaking admin UI when Supabase temporarily unavailable
      return res.json({ leads: [] });
    }

    return res.json({ leads: data || [] });
  } catch (err) {
    console.error('Leads GET error', err);
    return res.json({ leads: [] });
  }
});

module.exports = router;
