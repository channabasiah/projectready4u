'use client'
import { ArrowLeft } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Toaster, toast } from 'sonner'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    // Simulate registration - in real app, send to API
    setTimeout(() => {
      setLoading(false)
      toast.success('Account created! Signing you in...')
      // Sign in after registration
      signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/'
      })
      router.push('/')
    }, 1000)
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
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-white">Create Account</h1>
          <p className="text-center text-slate-400 mb-8 text-sm md:text-base">Join ProjectReady4U today</p>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
            <form onSubmit={handleRegister} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm md:text-base font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
              <div>
                <label className="block text-sm md:text-base font-medium text-slate-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 md:py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm md:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 md:py-3 px-4 md:px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 disabled:opacity-50 text-sm md:text-base"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm md:text-base mt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
