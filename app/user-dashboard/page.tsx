'use client'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Clock, Eye, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'

export default function UserDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }
    fetchUserRequests()
  }, [session, router])

  const fetchUserRequests = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/requests')
      const data = await res.json()
      // Filter requests by current user's email
      const userRequests = (data.requests || []).filter((r: any) => r.user_email === session?.user?.email)
      setRequests(userRequests)
    } catch (error) {
      toast.error('Failed to fetch your requests')
    } finally {
      setLoading(false)
    }
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending')
  const approvedRequests = requests.filter((r) => r.status === 'approved')

  if (!session) {
    return <div className="min-h-screen dark:bg-slate-950 flex items-center justify-center text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen dark:bg-gradient-to-br dark:from-slate-950 dark:via-purple-900 dark:to-slate-950 bg-gradient-to-br from-white via-purple-50 to-blue-50 p-4 md:p-8">
      <Toaster richColors />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">
              My Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg">Welcome back, {session.user?.name}! Track your project requests here.</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-6">
              <p className="text-slate-400 text-sm mb-2">Total Requests</p>
              <p className="text-3xl font-bold text-white">{requests.length}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="dark:bg-yellow-500/10 bg-yellow-50 rounded-lg border dark:border-yellow-500/20 border-yellow-200 p-6">
              <p className="text-yellow-600 dark:text-yellow-400 text-sm mb-2">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingRequests.length}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="dark:bg-green-500/10 bg-green-50 rounded-lg border dark:border-green-500/20 border-green-200 p-6">
              <p className="text-green-600 dark:text-green-400 text-sm mb-2">Approved</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{approvedRequests.length}</p>
            </div>
          </motion.div>
        </div>

        {/* Pending Requests */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-yellow-500" />
            <h2 className="text-2xl font-bold text-white">Pending Requests ({pendingRequests.length})</h2>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading your requests...</div>
          ) : pendingRequests.length === 0 ? (
            <div className="dark:bg-slate-800/30 bg-slate-100 rounded-lg border dark:border-slate-700 border-slate-200 p-8 text-center">
              <p className="text-slate-400 mb-4">No pending requests</p>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all"
              >
                Browse Projects
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-6 hover:dark:bg-slate-800 hover:bg-slate-50 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{request.project_name}</h3>
                        <span className="px-3 py-1 dark:bg-yellow-500/20 dark:text-yellow-400 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                          #{request.id}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-3">Submitted {new Date(request.requested_at).toLocaleDateString()}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="dark:bg-slate-700/50 bg-slate-100 px-3 py-1 rounded">
                          <p className="text-slate-400">Status</p>
                          <p className="text-white font-semibold capitalize">{request.status}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="self-start md:self-auto px-6 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Approved Requests */}
        {approvedRequests.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-green-500" />
              <h2 className="text-2xl font-bold text-white">Approved Requests ({approvedRequests.length})</h2>
            </div>

            <div className="space-y-4">
              {approvedRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="dark:bg-gradient-to-r dark:from-green-500/10 dark:to-emerald-500/10 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border dark:border-green-500/30 border-green-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <h3 className="text-xl font-bold text-white">{request.project_name}</h3>
                      </div>
                      <p className="text-slate-400 text-sm">Approved on {new Date(request.approved_at || request.requested_at).toLocaleDateString()}</p>
                    </div>

                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="self-start md:self-auto px-6 py-2 dark:bg-green-600 dark:hover:bg-green-700 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedRequest(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div 
              className="dark:bg-slate-900 bg-white rounded-lg p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{selectedRequest.project_name}</h3>
              <button onClick={() => setSelectedRequest(null)} className="p-1 hover:bg-slate-700/50 rounded">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Request ID</p>
                <p className="text-white font-mono text-sm">#{selectedRequest.id}</p>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-1">Status</p>
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  selectedRequest.status === 'pending'
                    ? 'dark:bg-yellow-500/20 dark:text-yellow-400 bg-yellow-100 text-yellow-700'
                    : 'dark:bg-green-500/20 dark:text-green-400 bg-green-100 text-green-700'
                }`}>
                  {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </span>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-1">Submitted Date</p>
                <p className="text-white">{new Date(selectedRequest.requested_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>

              {selectedRequest.status === 'approved' && (
                <div className="dark:bg-green-500/10 bg-green-50 border dark:border-green-500/20 border-green-200 rounded-lg p-4 mt-4">
                  <p className="text-green-700 dark:text-green-400 text-sm">
                    <strong>✅ Your request has been approved!</strong><br/>
                    The admin will contact you soon via WhatsApp or email with next steps.
                  </p>
                </div>
              )}
              {selectedRequest.status === 'pending' && (
                <div className="dark:bg-yellow-500/10 bg-yellow-50 border dark:border-yellow-500/20 border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                    <strong>⏳ Request Pending</strong><br/>
                    Your request is under review. Please check your email and WhatsApp for updates.
                  </p>
                </div>
              )}
            </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
