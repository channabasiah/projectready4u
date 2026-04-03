import { ProjectDetailsContent } from './project-details'

async function fetchProject(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = await fetch(`${base}/api/projects/${id}`, { cache: 'no-store' })
  return res.json()
}

export default async function ProjectPage({ 
  params 
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { project } = await fetchProject(id)
  if (!project) return <div className="p-6 text-center text-white">Project not found</div>
  return <ProjectDetailsContent project={project} />
}
