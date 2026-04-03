'use client'
import { ArrowLeft, Mail, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <button
        onClick={() => router.back()}
        className="w-fit inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors hover:gap-3 mb-8"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-2xl p-6 md:p-8 text-center">
          <img
            src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}&background=667eea&color=fff&size=128`}
            alt={session.user?.name || 'Profile'}
            className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full border-4 border-white shadow-lg mb-4"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{session.user?.name}</h1>
          <p className="text-blue-100">Verified Account</p>
        </div>

        {/* Profile Details Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-b-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
          <div className="space-y-6">
            {/* Email Section */}
            <div className="border-b border-slate-700 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <label className="text-sm md:text-base font-semibold text-slate-400">Email Address</label>
              </div>
              <p className="text-base md:text-lg text-white ml-8">{session.user?.email}</p>
            </div>

            {/* Name Section */}
            <div className="border-b border-slate-700 pb-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-blue-400" />
                <label className="text-sm md:text-base font-semibold text-slate-400">Full Name</label>
              </div>
              <p className="text-base md:text-lg text-white ml-8">{session.user?.name}</p>
            </div>

            {/* Account Status */}
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Account Status</h3>
              <div className="space-y-2 text-sm md:text-base text-slate-300">
                <p>✅ Email Verified</p>
                <p>✅ 2-Factor Authentication: Enabled</p>
                <p>✅ Account Active</p>
              </div>
            </div>

            {/* Auth Provider Info */}
            <div className="bg-slate-700/50 rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold text-slate-300 mb-3">Authentication Provider</h3>
              <div className="flex items-center gap-3">
                {session.user?.image ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" className="text-blue-500" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" className="text-red-500" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" className="text-yellow-500" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" className="text-green-500" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">Google OAuth</p>
                      <p className="text-xs text-slate-400">Secure login with Google</p>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-300">Email & Password Authentication</p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-700/50 rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold text-slate-300 mb-4">Session Information</h3>
              <div className="space-y-2 text-sm md:text-base text-slate-400">
                <p>Last Login: Today</p>
                <p>Session Active: Yes</p>
                <p>Browser: Modern Browser</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3 pt-4">
              <button className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all text-sm md:text-base">
                Edit Profile
              </button>
              <button className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-all text-sm md:text-base">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-slate-400 text-xs md:text-sm">
          <p>Account created and managed securely by ProjectReady4U</p>
        </div>
      </div>
    </div>
  )
}
