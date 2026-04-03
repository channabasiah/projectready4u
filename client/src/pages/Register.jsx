import { Link } from 'react-router-dom';
import StudentForm from '../components/StudentForm';

export default function Register() {
  return (
    <div className="min-h-screen bg-black text-yellow-200">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <nav className="text-sm text-yellow-300" aria-label="Breadcrumb">
            <ol className="inline-flex items-center gap-2">
              <li>
                <Link to="/" className="hover:text-yellow-100">
                  Home
                </Link>
              </li>
              <li className="text-yellow-500">/</li>
              <li className="font-semibold text-white">Register</li>
            </ol>
          </nav>
          <Link
            to="/"
            className="text-xl font-bold text-yellow-300 hover:text-white px-3 py-1 rounded-lg"
            aria-label="Close register" 
          >
            ✕
          </Link>
        </div>

        <div className="bg-yellow-200 text-black rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-4xl font-black">Register with ProjectReady4U</h1>
            <p className="text-lg">Submit your details and join our student lead program.</p>
          </div>
        </div>

        <div className="mt-8 bg-black/80 border border-yellow-300 rounded-3xl p-6">
          <StudentForm apiUrl={import.meta.env.VITE_API_URL} />
        </div>
      </div>
    </div>
  );
}
