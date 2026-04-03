'use client'
import { motion } from 'framer-motion'
import { Clock, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [approving, setApproving] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/requests')
      const data = await res.json()
      setRequests(data.requests || [])
    } catch (error) {
      toast.error('Failed to fetch requests')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId: any) => {
    setApproving(true)
    try {
      const res = await fetch(`/api/requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: 'Approved' }),
      })

      if (res.ok) {
        toast.success('Request approved!')
        fetchRequests()
        setSelectedRequest(null)
      } else {
        toast.error('Failed to approve request')
      }
    } catch (error) {
      toast.error('Error approving request')
    } finally {
      setApproving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
    }
  }

  const stats = [
    { label: 'Total Requests', value: requests.length, color: 'from-blue-500 to-cyan-500' },
    { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, color: 'from-yellow-500 to-orange-500' },
    { label: 'Approved', value: requests.filter(r => r.status === 'approved').length, color: 'from-green-500 to-emerald-500' },
  ]

  return (
    <div>
      <Toaster richColors />
      
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`glass dark:bg-slate-900/40 dark:backdrop-blur-xl bg-white/40 backdrop-blur-sm p-4 md:p-6 rounded-xl border dark:border-slate-700/50 border-white/20 flex items-center justify-between gap-4`}>
              <div>
                <p className="text-slate-400 text-xs md:text-sm font-medium">{stat.label}</p>
                <p className="text-2xl md:text-4xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`p-2 md:p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Requests Table */}
      <div className="glass dark:bg-slate-900/40 dark:backdrop-blur-xl bg-white/40 backdrop-blur-sm rounded-xl border dark:border-slate-700/50 border-white/20 overflow-hidden">
        <div className="p-4 md:p-6 border-b dark:border-slate-700/50 border-white/20">
          <h2 className="text-lg md:text-xl font-bold text-white">Access Requests</h2>
        </div>

        {loading ? (
          <div className="p-4 md:p-6 text-center text-slate-400 text-sm md:text-base">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="p-4 md:p-6 text-center text-slate-400 text-sm md:text-base">No requests yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead className="dark:bg-slate-800/50 bg-white/50 border-b dark:border-slate-700/50 border-white/20">
                <tr>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-slate-300 font-semibold text-xs md:text-sm">Date</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-slate-300 font-semibold text-xs md:text-sm">Name</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-slate-300 font-semibold text-xs md:text-sm hidden sm:table-cell">Email</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-slate-300 font-semibold text-xs md:text-sm">Status</th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-slate-300 font-semibold text-xs md:text-sm">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700/50 divide-white/20">
                {requests.map((req, i) => (
                  <tr key={i} className="hover:dark:bg-slate-800/30 hover:bg-white/20 transition-colors">
                    <td className="px-3 md:px-6 py-3 md:py-4 text-slate-300 text-xs md:text-sm">{req.request_date?.split('T')[0] || 'N/A'}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-slate-300 font-medium text-xs md:text-sm">{req.user_name}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-slate-400 text-xs hidden sm:table-cell">{req.user_email}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-lg dark:bg-purple-500/20 dark:text-purple-300 bg-purple-100 text-purple-600 hover:dark:bg-purple-500/30 hover:bg-purple-200 transition-colors text-xs font-semibold"
                      >
                        <Eye className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {selectedRequest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            onClick={() => setSelectedRequest(null)}
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="dark:bg-slate-900 bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-md w-full border dark:border-slate-700 border-white/20"
              >
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Request Details</h3>
                <div className="space-y-2 md:space-y-3 mb-6">
                  <p className="text-slate-300 text-sm md:text-base"><strong>Name:</strong> {selectedRequest.user_name}</p>
                  <p className="text-slate-300 text-sm md:text-base"><strong>Email:</strong> {selectedRequest.user_email}</p>
                  <p className="text-slate-300 text-sm md:text-base"><strong>College:</strong> {selectedRequest.user_college}</p>
                  <p className="text-slate-300 text-sm md:text-base"><strong>Phone:</strong> {selectedRequest.user_phone}</p>
                </div>

                {selectedRequest.status === 'pending' && (
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={approving}
                    className="w-full py-2 md:py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 text-sm md:text-base"
                  >
                    {approving ? 'Approving...' : 'Approve Request'}
                  </button>
                )}

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="w-full mt-2 py-2 md:py-3 dark:bg-slate-800 dark:text-slate-300 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:dark:bg-slate-700 hover:bg-slate-200 transition-colors text-sm md:text-base"
                >
                  Close
                </button>
                  </div>
                </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
