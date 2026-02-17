import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '../../../../../lib/db-client'
import { sendApprovalEmail } from '../../../../../lib/email'
import { access_requests, projects } from '../../../../../lib/schema'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}))
    
    // Update request status to approved
    const updated = await db
      .update(access_requests)
      .set({
        status: 'approved',
        admin_notes: body.admin_notes || '',
        approved_date: new Date().toISOString(),
      })
      .where(eq(access_requests.id, parseInt(params.id)))
      .returning()

    // Fetch the request with related data
    if (updated && updated[0]) {
      const approvedRequest = updated[0]
      
      // Fetch related project if project_id exists
      let project
      if (approvedRequest.project_id) {
        const projectData = await db
          .select()
          .from(projects)
          .where(eq(projects.id, approvedRequest.project_id))
          .limit(1)
        project = projectData[0]
      }

      // Send approval email
      await sendApprovalEmail(approvedRequest, project)

      return NextResponse.json({ approved: approvedRequest })
    }

    return NextResponse.json(
      { error: 'Request not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error approving request:', error)
    return NextResponse.json(
      { error: 'Failed to approve request' },
      { status: 500 }
    )
  }
}
