import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ onRegisterClick }) {
  return (
    <div className="sticky top-0 z-50 bg-black border-b border-yellow-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-black text-yellow-300">ProjectReady4U</h1>
        <div className="flex gap-3">
          <Link
            to="/"
            className="text-sm font-semibold px-3 py-2 rounded-lg bg-yellow-600 text-black hover:bg-yellow-500 transition"
          >
            Home
          </Link>
          <button
            onClick={onRegisterClick}
            className="text-sm font-semibold px-3 py-2 rounded-lg bg-yellow-400 text-black hover:bg-yellow-300 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
