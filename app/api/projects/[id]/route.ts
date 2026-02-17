import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '../../../../lib/db-client'
import { projects } from '../../../../lib/schema'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ project: result[0] })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    
    const body = await req.json()

    const updated = await db
      .update(projects)
      .set({
        project_name: body.name || body.project_name,
        description: body.description,
        category: body.category,
        tech_stack: body.tech_stack,
        what_included: body.what_included,
        price: body.price,
        discount_price: body.discount ? (body.price * (1 - body.discount / 100)) : undefined,
        github_repo_url: body.github_link || body.github_repo_url,
        demo_video_url: body.demo_link || body.demo_video_url,
      })
      .where(eq(projects.id, projectId))
      .returning()

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ project: updated[0] })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    const deleted = await db
      .delete(projects)
      .where(eq(projects.id, projectId))
      .returning()

    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Project deleted successfully', project: deleted[0] })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
