'use client'
import { LogOut, Menu, Settings } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [showMenu, setShowMenu] = React.useState(false)
  const router = useRouter()
  
  // Check if user is admin
  const isAdmin = session?.user?.email === 'admin@projectready4u.com'

  return (
    <nav className="sticky top-0 z-40 glass dark:bg-slate-900/60 dark:backdrop-blur-xl bg-white/40 backdrop-blur-sm border-b dark:border-slate-700/50 border-white/20">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          ProjectReady4U
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              {!isAdmin && (
                <Link href="/user-dashboard" className="px-4 py-2 rounded-lg dark:text-slate-300 text-slate-700 hover:dark:bg-slate-800/50 hover:bg-white/50 transition-colors font-medium">
                  My Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-lg dark:bg-purple-600/30 dark:text-purple-300 bg-purple-100 text-purple-700 hover:dark:bg-purple-600/50 hover:bg-purple-200 transition-colors font-medium">
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-3 px-4 py-2 rounded-lg dark:bg-slate-800/50 bg-white/50 hover:dark:bg-slate-700/50 hover:bg-white/70 transition-all cursor-pointer"
              >
                <img src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}`} alt="Avatar" className="w-8 h-8 rounded-full" />
                <span className="text-sm font-semibold text-slate-200">{session.user?.name}</span>
              </button>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg dark:bg-red-500/20 dark:text-red-400 text-red-600 bg-red-50 hover:bg-red-100 dark:hover:bg-red-500/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="px-4 py-2 rounded-lg dark:text-slate-300 text-slate-700 hover:dark:bg-slate-800/50 hover:bg-white/50 transition-colors">
                Sign In
              </Link>
              <Link href="/auth/register" className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setShowMenu(!showMenu)}
        >
          <Menu className="w-6 h-6 text-slate-300" />
        </button>
      </div>

      {showMenu && (
        <div className="md:hidden border-t dark:border-slate-700/50 border-white/20 p-4 space-y-2">
          {session ? (
            <>
              {!isAdmin && (
                <Link href="/user-dashboard" className="block w-full px-4 py-2 rounded-lg dark:text-slate-300 text-slate-700 hover:dark:bg-slate-800/50 hover:bg-white/50 font-medium">
                  My Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 w-full px-4 py-2 rounded-lg dark:bg-purple-600/30 dark:text-purple-300 bg-purple-100 text-purple-700 font-medium">
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  router.push('/profile')
                  setShowMenu(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg dark:bg-slate-800/50 bg-white/50 hover:dark:bg-slate-700/50 hover:bg-white/70 transition-all text-left"
              >
                <img src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}`} alt="Avatar" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-sm font-semibold text-slate-200">{session.user?.name}</p>
                  <p className="text-xs text-slate-400">View Profile</p>
                </div>
              </button>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg dark:bg-red-500/20 dark:text-red-400 text-red-600 bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block px-4 py-2 rounded-lg dark:text-slate-300 text-slate-700 hover:dark:bg-slate-800/50 hover:bg-white/50">
                Sign In
              </Link>
              <Link href="/auth/register" className="block px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-center">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
