'use client'
import { ArrowLeft, Lock } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Toaster, toast } from 'sonner'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@projectready4u.com')
  const [password, setPassword] = useState('admin123456')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/admin'
      })

      if (result?.ok) {
        toast.success('Admin login successful!')
        router.push('/admin')
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Toaster richColors />
      <button
        onClick={() => router.back()}
        className="w-fit inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors hover:gap-3 px-4 pt-4 mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Login</h1>
            </div>
            <p className="text-slate-400 text-sm md:text-base">Secure access to admin panel</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
            <form onSubmit={handleLogin} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm md:text-base font-medium text-slate-300 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@projectready4u.com"
                  required
                  className="w-full px-4 py-3 md:py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm md:text-base font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 md:py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm md:text-base"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 md:py-3 px-4 md:px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 disabled:opacity-50 text-sm md:text-base mt-6"
              >
                {loading ? 'Logging in...' : 'Admin Login'}
              </button>
            </form>

            {/* Demo Info Box */}
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 md:p-6 mb-6">
              <h3 className="text-sm md:text-base font-semibold text-blue-300 mb-3">Demo Credentials</h3>
              <div className="space-y-2 text-xs md:text-sm text-slate-300">
                <p><strong>Email:</strong> admin@projectready4u.com</p>
                <p><strong>Password:</strong> admin123456</p>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-slate-700/50 rounded-lg p-4 md:p-6">
              <h3 className="text-sm md:text-base font-semibold text-slate-300 mb-3">Admin Features</h3>
              <ul className="space-y-2 text-xs md:text-sm text-slate-400">
                <li>✅ View all access requests</li>
                <li>✅ Approve/Reject requests</li>
                <li>✅ Send emails to students</li>
                <li>✅ Manage project listings</li>
                <li>✅ View request statistics</li>
              </ul>
            </div>
          </div>

          <p className="text-center text-slate-400 text-xs md:text-sm mt-6">
            Not admin? <Link href="/" className="text-blue-400 hover:text-blue-300 font-semibold">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
