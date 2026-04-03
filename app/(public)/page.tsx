'use client'
import { ArrowRight, CheckCircle, Users, Zap } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProjectCard from '../components/ProjectCard'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = [
    'All',
    'Python Full Stack',
    'Data Analysis',
    'Data Science',
    'Generative AI',
    'Agentic AI',
    'Web Development',
    'Mobile Development',
    'Cloud Computing',
    'DevOps',
    'Machine Learning',
  ]

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const res = await fetch(`${base}/api/projects`, { cache: 'no-store' })
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen dark:bg-gradient-to-br dark:from-slate-950 dark:via-purple-900 dark:to-slate-950 bg-gradient-to-br from-white via-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
            ProjectReady4U
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-4">
            Your gateway to amazing student projects and learning opportunities
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Discover curated projects, request access, and get approved to start your journey
          </p>
        </div>

        {/* About Us Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-8 hover:dark:bg-slate-800 hover:bg-slate-50 transition-all">
            <Zap className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Wide Range of Projects</h3>
            <p className="text-slate-400">Access a diverse collection of student-friendly projects across various technologies and domains.</p>
          </div>

          <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-8 hover:dark:bg-slate-800 hover:bg-slate-50 transition-all">
            <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Easy Request Process</h3>
            <p className="text-slate-400">Simple one-click request process to get access to projects. Admins review and approve your request quickly.</p>
          </div>

          <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-8 hover:dark:bg-slate-800 hover:bg-slate-50 transition-all">
            <Users className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Community Support</h3>
            <p className="text-slate-400">Get support from admins and community. Track your requests and stay updated on approvals.</p>
          </div>
        </div>

        {/* Call to Action */}
        {!session && (
          <div className="dark:bg-gradient-to-r dark:from-purple-600/30 dark:to-pink-600/30 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border dark:border-purple-500/50 border-purple-200 p-8 text-center mb-16">
            <h2 className="text-2xl font-bold text-white mb-3">Get Started Now</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">Create an account to browse projects and request access</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/login"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/auth/register"
                className="px-8 py-3 dark:bg-slate-800 dark:hover:bg-slate-700 bg-white hover:bg-slate-100 dark:text-white text-slate-900 rounded-lg font-semibold border dark:border-slate-700 border-slate-200 transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Browse Projects Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            Browse Available Projects
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Explore our collection of carefully curated projects. Sign in to request access.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <p className="text-slate-600 dark:text-slate-300 mb-4 font-semibold">Filter by Category:</p>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'dark:bg-slate-800/50 dark:text-slate-300 bg-white text-slate-700 border dark:border-slate-700 border-slate-200 hover:dark:bg-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="dark:bg-slate-800/50 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-12 text-center">
            <p className="text-slate-400">No projects available in this category. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p: any) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>

      {/* Info Section at Bottom */}
      <section className="dark:bg-slate-900/50 bg-slate-50 border-t dark:border-slate-700/50 border-slate-200 py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 dark:bg-purple-600 bg-purple-100 dark:text-purple-400 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold text-white mb-2">Browse</h3>
              <p className="text-slate-400 text-sm">Explore our collection of student-ready projects</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 dark:bg-purple-600 bg-purple-100 dark:text-purple-400 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold text-white mb-2">Sign In</h3>
              <p className="text-slate-400 text-sm">Create an account or login to your profile</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 dark:bg-purple-600 bg-purple-100 dark:text-purple-400 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold text-white mb-2">Request</h3>
              <p className="text-slate-400 text-sm">Request access to projects you're interested in</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 dark:bg-purple-600 bg-purple-100 dark:text-purple-400 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                4
              </div>
              <h3 className="font-semibold text-white mb-2">Track</h3>
              <p className="text-slate-400 text-sm">Track your requests in your personal dashboard</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
