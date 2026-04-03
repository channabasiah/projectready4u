export default function Footer({ footerText }) {
  return (
    <footer className="bg-black text-yellow-200 py-6 border-t border-yellow-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <p>{footerText || '© 2026 ProjectReady4U. All rights reserved.'}</p>
      </div>
    </footer>
  );
}
