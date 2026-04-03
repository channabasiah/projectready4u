'use client'
import { motion } from 'framer-motion'
import { Check, Eye, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [approving, setApproving] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
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

  const handleReject = async (requestId: any) => {
    setApproving(true)
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Request rejected!')
        fetchRequests()
        setSelectedRequest(null)
      } else {
        toast.error('Failed to reject request')
      }
    } catch (error) {
      toast.error('Error rejecting request')
    } finally {
      setApproving(false)
    }
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending')
  const approvedRequests = requests.filter((r) => r.status === 'approved')
  const rejectedRequests = requests.filter((r) => r.status === 'rejected')

  return (
    <div className="space-y-6 md:space-y-8">
      <Toaster richColors />

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Access Requests</h1>
        <p className="text-slate-400">Manage student project access requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-4 md:p-6">
            <p className="text-slate-400 text-sm mb-2">Total Requests</p>
            <p className="text-2xl md:text-3xl font-bold text-white">{requests.length}</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="dark:bg-yellow-500/10 bg-yellow-50 rounded-lg border dark:border-yellow-500/20 border-yellow-200 p-4 md:p-6">
            <p className="text-yellow-600 dark:text-yellow-400 text-sm mb-2">Pending</p>
            <p className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingRequests.length}</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="dark:bg-green-500/10 bg-green-50 rounded-lg border dark:border-green-500/20 border-green-200 p-4 md:p-6">
            <p className="text-green-600 dark:text-green-400 text-sm mb-2">Approved</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">{approvedRequests.length}</p>
          </div>
        </motion.div>
      </div>

      {/* Pending Requests */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
          Pending Requests ({pendingRequests.length})
        </h2>
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading requests...</div>
        ) : pendingRequests.length === 0 ? (
          <div className="text-center py-12 dark:bg-slate-800/30 bg-slate-100 rounded-lg border dark:border-slate-700 border-slate-200">
            <p className="text-slate-400">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-4 md:p-6 hover:dark:bg-slate-800 hover:bg-slate-50 transition-all duration-200">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <h3 className="text-lg md:text-xl font-bold text-white">{request.user_name}</h3>
                      <span className="inline-block px-3 py-1 dark:bg-yellow-500/20 dark:text-yellow-400 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full w-fit">
                        #{request.id}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">{request.user_email}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400">Phone</p>
                        <p className="text-white font-mono">{request.user_phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Project</p>
                        <p className="text-white">{request.project_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg font-semibold transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={approving}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg font-semibold transition-colors text-sm disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={approving}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-semibold transition-colors text-sm disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Reject
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
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Approved Requests ({approvedRequests.length})
          </h2>
          <div className="space-y-3">
            {approvedRequests.map((request) => (
              <div key={request.id} className="dark:bg-slate-800/30 bg-slate-50 rounded-lg border dark:border-green-500/20 border-green-200 p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white">{request.user_name}</p>
                    <p className="text-sm text-slate-400">{request.project_name}</p>
                  </div>
                  <span className="text-xs dark:text-green-400 text-green-600 font-semibold">Approved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            onClick={() => setSelectedRequest(null)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="dark:bg-slate-900 bg-white rounded-lg p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Request #{selectedRequest.id}</h3>
              <button onClick={() => setSelectedRequest(null)} className="p-1 hover:bg-slate-700/50 rounded">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Student Name</p>
                <p className="text-white font-semibold">{selectedRequest.user_name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Email</p>
                <p className="text-white font-mono text-sm">{selectedRequest.user_email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Phone</p>
                <p className="text-white font-mono">{selectedRequest.user_phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Project</p>
                <p className="text-white font-semibold">{selectedRequest.project_name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Status</p>
                <span className="inline-block px-3 py-1 dark:bg-yellow-500/20 dark:text-yellow-400 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full capitalize">
                  {selectedRequest.status}
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Requested Date</p>
                <p className="text-white text-sm">{new Date(selectedRequest.requested_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(selectedRequest.id)}
                disabled={approving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => handleReject(selectedRequest.id)}
                disabled={approving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
