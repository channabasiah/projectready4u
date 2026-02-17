'use client'
import { motion } from 'framer-motion'
import { Mail, Save, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [emailSettings, setEmailSettings] = useState({
    adminEmail: '',
    from_name: '',
    reply_to: '',
  })

  useEffect(() => {
    // Load settings from localStorage or initialize with defaults
    const saved = localStorage.getItem('adminSettings')
    if (saved) {
      setEmailSettings(JSON.parse(saved))
    } else {
      setEmailSettings({
        adminEmail: session?.user?.email || '',
        from_name: 'ProjectReady4U',
        reply_to: session?.user?.email || '',
      })
    }
  }, [session])

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // Save to localStorage
      localStorage.setItem('adminSettings', JSON.stringify(emailSettings))
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl">
      <Toaster richColors />

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Settings</h1>
        <p className="text-slate-400">Manage your admin preferences and configurations</p>
      </div>

      {/* Email Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Email Configuration</h2>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Admin Email Address</label>
            <input
              type="email"
              value={emailSettings.adminEmail}
              onChange={(e) => setEmailSettings({ ...emailSettings, adminEmail: e.target.value })}
              placeholder="admin@projectready4u.com"
              className="w-full px-4 py-2 bg-slate-900/50 border dark:border-slate-600 border-slate-300 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <p className="text-xs text-slate-400 mt-1">Used for sending emails and receiving notifications</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">From Name</label>
            <input
              type="text"
              value={emailSettings.from_name}
              onChange={(e) => setEmailSettings({ ...emailSettings, from_name: e.target.value })}
              placeholder="ProjectReady4U"
              className="w-full px-4 py-2 bg-slate-900/50 border dark:border-slate-600 border-slate-300 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <p className="text-xs text-slate-400 mt-1">Display name for email communications</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Reply-To Email</label>
            <input
              type="email"
              value={emailSettings.reply_to}
              onChange={(e) => setEmailSettings({ ...emailSettings, reply_to: e.target.value })}
              placeholder="support@projectready4u.com"
              className="w-full px-4 py-2 bg-slate-900/50 border dark:border-slate-600 border-slate-300 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <p className="text-xs text-slate-400 mt-1">Where recipients should reply to</p>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
        </div>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Account Information</h2>
          </div>

          <div className="space-y-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">Admin Name</p>
            <p className="text-white font-semibold">{session?.user?.name || 'Admin'}</p>
          </div>
          <div className="h-px dark:bg-slate-700 bg-slate-200"></div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Email</p>
            <p className="text-white font-mono text-sm">{session?.user?.email || 'Not available'}</p>
          </div>
          <div className="h-px dark:bg-slate-700 bg-slate-200"></div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Account Status</p>
            <p className="text-white">
              <span className="inline-block px-3 py-1 dark:bg-green-500/20 dark:text-green-400 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Active
              </span>
            </p>
          </div>
        </div>
        </div>
      </motion.div>

      {/* System Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-6 md:p-8">
          <h2 className="text-lg font-bold text-white mb-4">System Information</h2>
          <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <p className="text-slate-400">Platform Version</p>
            <p className="text-white font-mono">1.0.0</p>
          </div>
          <div className="h-px dark:bg-slate-700 bg-slate-200"></div>
          <div className="flex items-center justify-between">
            <p className="text-slate-400">Database</p>
            <p className="text-white font-mono">SQLite</p>
          </div>
          <div className="h-px dark:bg-slate-700 bg-slate-200"></div>
          <div className="flex items-center justify-between">
            <p className="text-slate-400">Authentication</p>
            <p className="text-white">NextAuth.js</p>
          </div>
          <div className="h-px dark:bg-slate-700 bg-slate-200"></div>
          <div className="flex items-center justify-between">
            <p className="text-slate-400">Last Updated</p>
            <p className="text-white text-xs">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="dark:bg-gradient-to-br dark:from-purple-500/10 dark:to-pink-500/10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border dark:border-purple-500/20 border-purple-200 p-6 md:p-8">
          <h3 className="text-lg font-bold text-white mb-3">Need Help?</h3>
          <p className="text-slate-400 mb-4">For more information about managing your admin panel and configurations, please refer to the documentation.</p>
          <button className="px-4 py-2 dark:bg-purple-600 dark:hover:bg-purple-700 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors text-sm">
            View Documentation
          </button>
        </div>
      </motion.div>
    </div>
  )
}
