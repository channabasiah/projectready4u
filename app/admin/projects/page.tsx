'use client'
import { motion } from 'framer-motion'
import { Edit2, Eye, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tech_stack: '',
    demo_video_url: '',
    what_included: '',
    price: '',
    discount: '',
    github_link: '',
    demo_link: '',
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (error) {
      toast.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      if (editingId) {
        // Update project
        const res = await fetch(`/api/projects/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project_name: formData.name,
            description: formData.description,
            category: formData.category,
            tech_stack: formData.tech_stack ? JSON.stringify(formData.tech_stack.split(',').map((t: string) => t.trim())) : JSON.stringify([]),
            demo_video_url: formData.demo_video_url,
            what_included: formData.what_included ? JSON.stringify(formData.what_included.split('\n').filter((item: string) => item.trim())) : JSON.stringify([]),
            price: parseFloat(formData.price),
            discount: formData.discount ? parseInt(formData.discount) : 0,
            github_repo_url: formData.github_link,
          }),
        })

        if (res.ok) {
          toast.success('Project updated successfully!')
          setEditingId(null)
          setFormData({
            name: '',
            description: '',
            category: '',
            tech_stack: '',
            demo_video_url: '',
            what_included: '',
            price: '',
            discount: '',
            github_link: '',
            demo_link: '',
          })
          setShowAddForm(false)
          fetchProjects()
        } else {
          toast.error('Failed to update project')
        }
      } else {
        // Add new project
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project_name: formData.name,
            description: formData.description,
            category: formData.category,
            tech_stack: formData.tech_stack ? JSON.stringify(formData.tech_stack.split(',').map((t: string) => t.trim())) : JSON.stringify([]),
            demo_video_url: formData.demo_video_url,
            what_included: formData.what_included ? JSON.stringify(formData.what_included.split('\n').filter((item: string) => item.trim())) : JSON.stringify([]),
            price: parseFloat(formData.price),
            discount: formData.discount ? parseInt(formData.discount) : 0,
            github_repo_url: formData.github_link,
          }),
        })

        if (res.ok) {
          toast.success('Project added successfully!')
          setFormData({
            name: '',
            description: '',
            category: '',
            tech_stack: '',
            demo_video_url: '',
            what_included: '',
            price: '',
            discount: '',
            github_link: '',
            demo_link: '',
          })
          setShowAddForm(false)
          fetchProjects()
        } else {
          toast.error('Failed to add project')
        }
      }
    } catch (error) {
      toast.error('Error saving project')
    }
  }

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Project deleted!')
        fetchProjects()
      } else {
        toast.error('Failed to delete project')
      }
    } catch (error) {
      toast.error('Error deleting project')
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <Toaster richColors />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Projects</h1>
          <p className="text-slate-400">Manage all your projects here</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-200 w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Add New Project
        </button>
      </div>

      {/* Add/Edit Project Form */}
      {(showAddForm || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="dark:bg-slate-800/50 bg-white rounded-xl border dark:border-slate-700 border-slate-200 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
          <form onSubmit={handleAddProject} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Project Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. E-Commerce Platform"
                  className="w-full px-4 py-2 bg-slate-900/50 border dark:border-slate-600 border-slate-300 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border dark:border-slate-600 border-slate-300 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="">Select Category</option>
                  <option value="Python Full Stack">Python Full Stack</option>
                  <option value="Data Analysis">Data Analysis</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Generative AI">Generative AI</option>
                  <option value="Agentic AI">Agentic AI</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Machine Learning">Machine Learning</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the project..."
                rows={4}
                className="w-full px-4 py-2 bg-slate-900/50 border dark:border-slate-600 border-slate-300 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tech Stack</label>
              <input
                type="text"
                value={formData.tech_stack}
                onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                placeholder="e.g. React, Node.js, MongoDB, Express"
                className="w-full px-4 py-2 bg-slate-900/50 border dark:border-slate-600 border-slate-300 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <p className="text-xs text-slate-400 mt-1">Separate technologies with commas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Price ($) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="9999"
                  className="w-full px-4 py-2 bg-slate-900/50 border dark:border-slate-600 border-slate-300 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Discount (%)</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  placeholder="10"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 bg-slate-900/50 border dark:border-slate-600 border-slate-300 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">GitHub Link</label>
                <input
                  type="url"
                  value={formData.github_link}
                  onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2 bg-slate-900/50 border dark:border-slate-600 border-slate-300 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Demo Video URL (YouTube)</label>
                <input
                  type="url"
                  value={formData.demo_video_url}
                  onChange={(e) => setFormData({ ...formData, demo_video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2 bg-slate-900/50 border dark:border-slate-600 border-slate-300 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">What's Included</label>
              <textarea
                value={formData.what_included}
                onChange={(e) => setFormData({ ...formData, what_included: e.target.value })}
                placeholder="Enter each item on a new line:\nComplete Source Code\nDatabase Files\nSetup Instructions\nDocumentation\nPPT Template"
                rows={5}
                className="w-full px-4 py-2 bg-slate-900/50 border dark:border-slate-600 border-slate-300 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <p className="text-xs text-slate-400 mt-1">Enter each item on a new line</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 md:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-200"
              >
                {editingId ? 'Update Project' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                  setFormData({
                    name: '',
                    description: '',
                    category: '',
                    tech_stack: '',
                    demo_video_url: '',
                    what_included: '',
                    price: '',
                    discount: '',
                    github_link: '',
                    demo_link: '',
                  })
                }}
                className="flex-1 px-4 py-2 md:py-3 dark:bg-slate-700 dark:hover:bg-slate-600 bg-slate-300 hover:bg-slate-400 text-white rounded-lg font-semibold transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        </motion.div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 dark:bg-slate-800/30 bg-slate-100 rounded-lg">
            <p className="text-slate-400 mb-4">No projects yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create First Project
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
              <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-4 md:p-6 hover:dark:bg-slate-800 hover:bg-slate-50 transition-all duration-200">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">{project.name}</h3>
                    <p className="text-slate-400 text-sm md:text-base mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      {project.category && (
                        <span className="px-3 py-1 dark:bg-slate-700/50 bg-slate-200 text-slate-300 rounded-full">
                          {project.category}
                        </span>
                      )}
                      <span className="px-3 py-1 dark:bg-purple-500/20 bg-purple-100 text-purple-300 font-semibold rounded-full">
                        ${project.price}
                      </span>
                      {project.discount > 0 && (
                        <span className="px-3 py-1 dark:bg-green-500/20 bg-green-100 text-green-400 font-semibold rounded-full">
                          {project.discount}% Off
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => window.open(`/project/${project.id}`, '_blank')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg font-semibold transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(project.id)
                        setFormData({
                          name: project.name,
                          description: project.description,
                          category: project.category || '',
                          tech_stack: typeof project.tech_stack === 'string' ? project.tech_stack : (Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : ''),
                          demo_video_url: project.demo_video_url || '',
                          what_included: typeof project.what_included === 'string' ? project.what_included : (Array.isArray(project.what_included) ? project.what_included.join('\n') : ''),
                          price: project.price.toString(),
                          discount: project.discount.toString(),
                          github_link: project.github_link || '',
                          demo_link: project.demo_link || '',
                        })
                      }}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 dark:bg-yellow-500/20 dark:text-yellow-400 dark:hover:bg-yellow-500/30 bg-yellow-100 text-yellow-600 hover:bg-yellow-200 rounded-lg font-semibold transition-colors text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-semibold transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
