'use client'
import Link from 'next/link'

export default function ProjectCard({ project }: { project: any }) {
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

  return (
    <div className="glass rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <Link href={`/project/${project.id}`} className="block">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{project.project_name}</h3>
          <div className="text-sm text-slate-500">{project.category}</div>
        </div>
        <p className="mt-3 text-sm text-slate-600 line-clamp-3">{project.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="space-x-2">
            {techStack?.slice(0,3).map((t: string, i: number)=>(
              <span key={i} className="inline-flex items-center px-2 py-1 bg-white/60 text-xs rounded-full">{t}</span>
            ))}
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400 line-through">₹{project.price}</div>
            <div className="text-lg font-bold text-green-600">₹{project.discount_price}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}
