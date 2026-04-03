const bcrypt = require('bcryptjs');
const supabase = require('./supabaseClient');
require('dotenv').config();

async function runSeed() {
  try {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const adminId = '00000000-0000-0000-0000-000000000001';

    const { error: adminError } = await supabase.from('admins').upsert({
      id: adminId,
      username: adminUsername,
      password_hash: passwordHash,
    });
    if (adminError) {
      console.error('Error upserting admin:', adminError);
      process.exit(1);
    }

    const defaultContent = [
      { key: 'hero_title', value: 'Join ProjectReady4U - Your Career Starts Here' },
      { key: 'hero_subtitle', value: 'Submit your details and our team will connect with you soon.' },
      { key: 'cta_text', value: 'Register Your Interest' },
      { key: 'what_included_title', value: 'What You Get with ProjectReady4U' },
      {
        key: 'what_included_text',
        value:
          '• Career readiness guidance\n• Resume and portfolio support\n• Interview coaching & mock tests\n• Network with mentors & employers\n• Scholarship and internship connection',
      },
      { key: 'contact_phone', value: '+1234567890' },
      { key: 'contact_email', value: 'hello@projectready4u.com' },
      { key: 'contact_whatsapp', value: '1234567890' },
      { key: 'footer_text', value: '© 2026 ProjectReady4U. All rights reserved.' },
    ];

    const { error: contentError } = await supabase.from('site_content').upsert(defaultContent);
    if (contentError) {
      console.error('Error upserting site content:', contentError);
      process.exit(1);
    }

    console.log('Seed complete. Admin and site content are ready.');
  } catch (err) {
    console.error('Seed script error:', err);
    process.exit(1);
  }
}

runSeed();
