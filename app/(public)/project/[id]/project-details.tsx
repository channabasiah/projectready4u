'use client'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import RequestModal from '../../../../components/RequestModal'

export function ProjectDetailsContent({ project }: { project: any }) {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  // Parse tech_stack if it's a JSON string
  let techStack: string[] = []
  if (typeof project.tech_stack === 'string') {
    try {
      techStack = JSON.parse(project.tech_stack)
    } catch (e) {
      techStack = []
    }
  } else if (Array.isArray(project.tech_stack)) {
    techStack = project.tech_stack
  }

  // Parse what_included if it's a JSON string
  let whatIncluded: string[] = []
  if (typeof project.what_included === 'string') {
    try {
      whatIncluded = JSON.parse(project.what_included)
    } catch (e) {
      whatIncluded = []
    }
  } else if (Array.isArray(project.what_included)) {
    whatIncluded = project.what_included
  }

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-white p-4 md:p-6">
      <div className="container mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg dark:bg-slate-800/50 dark:hover:bg-slate-700/50 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 text-slate-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="glass dark:bg-slate-900/40 dark:backdrop-blur-xl bg-white/40 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border dark:border-purple-500/20 border-white/20">
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4">
            {project.project_name}
          </h1>

          <div className="flex items-center gap-4 md:gap-6 mb-6 flex-wrap">
            <div className="flex gap-2 md:gap-4 items-baseline">
              <span className="text-lg md:text-2xl font-bold text-slate-500 line-through">₹{project.price}</span>
              <span className="text-2xl md:text-4xl font-extrabold text-green-500">₹{project.discount_price}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {techStack?.map((t: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 dark:from-purple-500/30 dark:to-blue-500/30 border border-purple-400/50 dark:border-purple-400/30 rounded-full text-sm font-semibold text-purple-300">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div>
              <div className="mb-6">
                <h3 className="text-base md:text-lg font-bold text-white mb-3">Demo Video</h3>
                <div className="relative overflow-hidden rounded-xl bg-black/50 border border-purple-500/20">
                  <iframe 
                    className="w-full aspect-video rounded-lg" 
                    src={`https://www.youtube.com/embed/${extractYouTubeId(project.demo_video_url)}`} 
                    title="Demo video" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold text-white">Description</h3>
              <p className="text-slate-300 dark:text-slate-300 mt-4 leading-relaxed text-sm md:text-base">{project.description}</p>

              <h3 className="text-base md:text-lg font-semibold text-white">What's Included</h3>
              <ul className="mt-4 space-y-2">
                {whatIncluded.length > 0 ? (
                  whatIncluded.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                      <span className="text-green-400 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 text-sm">No items specified</li>
                )}
              </ul>
            </div>
          </section>

          <div className="mt-8 flex gap-3 md:gap-4 flex-wrap">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 min-w-[150px] md:min-w-[200px] py-3 md:py-4 px-4 md:px-6 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base md:text-lg transition-all duration-200 hover:shadow-lg"
            >
              Request Access
            </button>
          </div>
        </div>
      </div>

      <RequestModal isOpen={showModal} onClose={() => setShowModal(false)} projectId={String(project.id)} />
    </div>
  )
}

function extractYouTubeId(url: string | undefined) {
  if (!url) return ''
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/)
  return m ? m[1] : url
}
