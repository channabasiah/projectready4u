'use client'
import { ArrowLeft } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { Toaster, toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      toast.error('Invalid credentials')
    } else if (res?.ok) {
      toast.success('Logged in successfully!')
      router.push('/')
    }
  }

  if (error) {
    toast.error('Authentication failed. Try again.')
  }

  return (
    <div className="min-h-screen dark:bg-gradient-to-br dark:from-slate-950 dark:via-purple-900 dark:to-slate-950 from-white via-purple-50 to-blue-50 flex flex-col p-4 md:p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg dark:bg-slate-800/50 dark:hover:bg-slate-700/50 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 text-slate-700 font-medium transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <Toaster richColors />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="glass-dark dark:bg-slate-900/40 dark:backdrop-blur-xl bg-white/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border dark:border-purple-500/20 border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-2">
                ProjectReady4U
              </h1>
              <p className="text-sm md:text-base text-slate-400">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 text-sm md:text-base bg-slate-800/50 border dark:border-slate-700 border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 text-sm md:text-base bg-slate-800/50 border dark:border-slate-700 border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <div className="text-right mt-2">
                  <Link href="/auth/forgot-password" className="text-xs md:text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 text-sm md:text-base rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-slate-400">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
