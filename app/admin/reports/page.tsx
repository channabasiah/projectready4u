'use client'
import { motion } from 'framer-motion'
import { Briefcase, CheckCircle, TrendingUp, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'

export default function ReportsPage() {
  const [reportData, setReportData] = useState({
    totalProjects: 0,
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
    totalStudents: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const [projectsRes, requestsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/requests'),
      ])

      const projectsData = await projectsRes.json()
      const requestsData = await requestsRes.json()

      const projects = projectsData.projects || []
      const requests = requestsData.requests || []

      setReportData({
        totalProjects: projects.length,
        totalRequests: requests.length,
        approvedRequests: requests.filter((r: any) => r.status === 'approved').length,
        pendingRequests: requests.filter((r: any) => r.status === 'pending').length,
        totalStudents: new Set(requests.map((r: any) => r.user_email)).size,
      })
    } catch (error) {
      toast.error('Failed to load report data')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      icon: Briefcase,
      label: 'Total Projects',
      value: reportData.totalProjects,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'dark:bg-blue-500/10 bg-blue-50',
    },
    {
      icon: Users,
      label: 'Total Students',
      value: reportData.totalStudents,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'dark:bg-purple-500/10 bg-purple-50',
    },
    {
      icon: TrendingUp,
      label: 'Total Requests',
      value: reportData.totalRequests,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'dark:bg-pink-500/10 bg-pink-50',
    },
    {
      icon: CheckCircle,
      label: 'Approved',
      value: reportData.approvedRequests,
      color: 'from-green-500 to-green-600',
      bgColor: 'dark:bg-green-500/10 bg-green-50',
    },
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      <Toaster richColors />

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Reports & Analytics</h1>
        <p className="text-slate-400">Overview of your platform activity</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading report data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`${card.bgColor} rounded-lg border dark:border-slate-700 border-slate-200 p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${card.color} rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">{card.label}</p>
                <p className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-6 md:p-8">
            <h3 className="text-lg font-bold text-white mb-4">Request Status Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400">Pending</p>
                  <p className="text-lg font-bold text-yellow-500">{reportData.pendingRequests}</p>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: reportData.totalRequests > 0 ? `${(reportData.pendingRequests / reportData.totalRequests) * 100}%` : '0%',
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400">Approved</p>
                  <p className="text-lg font-bold text-green-500">{reportData.approvedRequests}</p>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: reportData.totalRequests > 0 ? `${(reportData.approvedRequests / reportData.totalRequests) * 100}%` : '0%',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-6 md:p-8">
            <h3 className="text-lg font-bold text-white mb-4">Key Metrics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Avg Requests per Project</p>
                <p className="font-semibold text-white">
                  {reportData.totalProjects > 0 ? (reportData.totalRequests / reportData.totalProjects).toFixed(1) : '0'}
                </p>
              </div>
              <div className="h-px dark:bg-slate-700 bg-slate-200"></div>
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Approval Rate</p>
                <p className="font-semibold text-white">
                  {reportData.totalRequests > 0 ? `${((reportData.approvedRequests / reportData.totalRequests) * 100).toFixed(1)}%` : '0%'}
                </p>
              </div>
              <div className="h-px dark:bg-slate-700 bg-slate-200"></div>
              <div className="flex items-center justify-between">
                <p className="text-slate-400">Conversion Rate</p>
                <p className="font-semibold text-white">
                  {reportData.totalStudents > 0 && reportData.approvedRequests > 0
                    ? `${((reportData.approvedRequests / reportData.totalStudents) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* More Analytics Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-6 md:p-8 text-center">
        <p className="text-slate-400 mb-4">Advanced analytics coming soon</p>
        <p className="text-sm text-slate-500">Charts, trends, and detailed breakdowns by category will be available in the next update.</p>
        </div>
      </motion.div>
    </div>
  )
}
