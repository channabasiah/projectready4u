import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StudentForm from '../components/StudentForm';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_URL = rawApiUrl ? rawApiUrl.replace(/\/+$/, '') : '';

function buildApiPath(path) {
  if (API_URL) {
    return `${API_URL}${path}`;
  }
  return path; // same origin API path if not configured
}

const defaultContent = {
  hero_title: 'Join ProjectReady4U - Your Career Starts Here',
  hero_subtitle: 'Submit your details and our team will connect with you soon.',
  cta_text: 'Register Your Interest',
  contact_phone: '+1234567890',
  contact_email: 'hello@projectready4u.com',
  contact_whatsapp: '1234567890',
  footer_text: '© 2026 ProjectReady4U. All rights reserved.',
};

export default function Home() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await axios.get(buildApiPath('/api/content'));
        setContent(response.data.content || defaultContent);
      } catch (err) {
        console.error('Failed to fetch content:', err);
        setError('Unable to load content; showing fallback');
        setContent(defaultContent);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="bg-black text-yellow-100 min-h-screen">
      <Navbar onRegisterClick={() => setShowRegisterModal(true)} />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading && <div className="py-8 text-center text-yellow-300">Loading content...</div>}
        {error && <div className="py-2 px-4 bg-yellow-900 text-yellow-100 rounded-lg mb-4">{error}</div>}
      </div>
      <Hero
        heroTitle={content.hero_title}
        heroSubtitle={content.hero_subtitle}
        ctaText={content.cta_text}
        onAction={() => setShowRegisterModal(true)}
      />

      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10">
          <div className="relative w-full max-w-3xl rounded-2xl bg-black/95 border border-yellow-500 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 text-yellow-300 hover:text-white text-3xl leading-none"
              aria-label="Close register modal"
            >
              ×
            </button>
            <h2 className="text-3xl font-extrabold text-yellow-200 mb-3">Register with ProjectReady4U</h2>
            <p className="text-yellow-100 mb-5">Submit your details and join our student lead program.</p>
            <StudentForm apiUrl={API_URL} onSuccess={() => setShowRegisterModal(false)} />
          </div>
        </div>
      )}

      <section className="bg-slate-950 py-14">
        <div className="max-w-5xl mx-auto px-4 text-left">
          <h3 className="text-3xl md:text-4xl font-extrabold text-yellow-300">{content.what_included_title || 'What You Get'}</h3>
          <div className="mt-4 text-yellow-100 space-y-2">
            {String(content.what_included_text || '• Career readiness guidance\n• Resume and portfolio support\n• Interview coaching & mock tests\n• Network with mentors & employers\n• Scholarship and internship connection')
              .split('\n')
              .filter((line) => line.trim())
              .map((line, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-yellow-300 mr-1">•</span>
                  <span>{line.replace(/^•\s*/, '')}</span>
                </div>
              ))}
          </div>
        </div>
      </section>

      <ContactSection content={content} />
      <Footer footerText={content.footer_text} />
    </div>
  );
}
