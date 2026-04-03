export default function ContactSection({ content }) {
  const phone = content.contact_phone || '0000000000';
  const email = content.contact_email || 'info@example.com';
  const whatsapp = content.contact_whatsapp || '0000000000';

  return (
    <section className="px-4 py-16 sm:px-6 bg-black text-yellow-100">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-center text-yellow-300">Get In Touch</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <a href={`tel:${phone}`} className="bg-yellow-950/60 border border-yellow-700 rounded-xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-2xl transform transition">
            <p className="text-4xl mb-3">📞</p>
            <h4 className="font-semibold mb-1 text-yellow-200">Phone</h4>
            <p className="text-yellow-100">{phone}</p>
          </a>

          <a href={`mailto:${email}`} className="bg-yellow-950/60 border border-yellow-700 rounded-xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-2xl transform transition">
            <p className="text-4xl mb-3">✉️</p>
            <h4 className="font-semibold mb-1 text-yellow-200">Email</h4>
            <p className="text-yellow-100">{email}</p>
          </a>

          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="bg-yellow-950/60 border border-yellow-700 rounded-xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-2xl transform transition">
            <p className="text-4xl mb-3">💬</p>
            <h4 className="font-semibold mb-1 text-yellow-200">WhatsApp</h4>
            <div className="relative inline-flex items-center gap-2 bg-yellow-300 text-black px-3 py-2 rounded-lg">
              <span>Chat</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
