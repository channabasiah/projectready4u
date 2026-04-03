'use client'
import { BarChart, Briefcase, FileText, LayoutDashboard, LogOut, Menu, Settings, X } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
    }
  }, [session, router])

  if (!session) {
    return <div className="min-h-screen dark:bg-slate-950 flex items-center justify-center text-white">Loading...</div>
  }

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/requests', icon: FileText, label: 'Access Requests' },
    { href: '/admin/projects', icon: Briefcase, label: 'Manage Projects' },
    { href: '/admin/reports', icon: BarChart, label: 'Reports' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-white">
      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed md:static w-64 dark:bg-slate-900 bg-slate-100 border-r dark:border-slate-700 border-slate-200 p-4 md:p-6 min-h-screen transform transition-transform duration-300 ease-in-out z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">ProjectReady4U</h2>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-slate-700/50 rounded-lg">
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>
          <nav className="space-y-2 md:space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href === '/admin' && pathname === '/admin')
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 md:py-3 rounded-lg transition-all duration-200 text-sm md:text-base font-medium ${
                    isActive
                      ? 'dark:bg-gradient-to-r dark:from-purple-600/40 dark:to-pink-600/40 dark:text-purple-300 bg-purple-100 text-purple-600'
                      : 'dark:text-slate-300 text-slate-700 dark:hover:bg-slate-800/50 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 pt-6 border-t dark:border-slate-700 border-slate-300">
            <div className="text-xs text-slate-400 mb-4 px-4">Admin Account</div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-2 md:py-3 rounded-lg dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition-all duration-200 text-sm md:text-base"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 dark:bg-slate-800 dark:text-slate-300 bg-slate-100 text-slate-700 rounded-lg hover:dark:bg-slate-700 hover:bg-slate-200 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-30"
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 w-full md:w-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
