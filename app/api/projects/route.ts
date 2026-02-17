import { NextResponse } from 'next/server'
import { db } from '../../../lib/db-client'
import { projects } from '../../../lib/schema'

export async function GET(req: Request) {
  try {
    const allProjects = await db.select().from(projects)
    return NextResponse.json({ projects: allProjects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const created = await db.insert(projects).values({
      id: `project-${Date.now()}`,
      project_name: body.name || body.project_name,
      description: body.description,
      category: body.category,
      tech_stack: body.tech_stack,
      what_included: body.what_included,
      price: body.price,
      discount_price: body.discount && body.price ? (body.price * (1 - body.discount / 100)) : body.price,
      github_repo_url: body.github_link || body.github_repo_url,
      demo_video_url: body.demo_link || body.demo_video_url,
      createdAt: new Date().toISOString(),
    }).returning()

    return NextResponse.json({ project: created[0] })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
