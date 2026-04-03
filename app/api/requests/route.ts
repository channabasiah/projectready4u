import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '../../../lib/db-client'
import { sendAdminNotification, sendRequestConfirmationEmail } from '../../../lib/email'
import { access_requests, projects } from '../../../lib/schema'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Handle both field name variations (some might come as user_name, some as name)
    const userName = body.user_name || body.name
    const userEmail = body.user_email || body.email
    const userCollege = body.user_college || body.college
    const userPhone = body.user_phone || body.phone
    
    // Convert project_id to number if it's a string
    let projectId = body.project_id
    if (typeof projectId === 'string') {
      projectId = parseInt(projectId, 10)
    }
    
    const result = await db.insert(access_requests).values({
      id: `request-${Date.now()}`,
      user_name: userName,
      user_email: userEmail,
      user_college: userCollege,
      user_phone: userPhone,
      projectId: projectId?.toString() || '',
      status: 'pending',
      request_date: new Date().toISOString(),
    }).returning()
    
    // Send admin notification with project details (non-blocking - don't await)
    if (result && result[0]) {
      // Fetch project details and send emails in the background
      (async () => {
        try {
          const project = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1)
          if (project && project[0]) {
            // Send emails without awaiting
            sendAdminNotification(project[0].project_name, process.env.ADMIN_EMAIL || 'admin@example.com').catch(err => 
              console.error('Error sending admin notification:', err)
            )
            sendRequestConfirmationEmail(result[0].user_email, project[0].project_name).catch(err =>
              console.error('Error sending confirmation email:', err)
            )
          }
        } catch (fetchError) {
          console.error('Error fetching project for emails:', fetchError)
        }
      })()
    }
    
    return NextResponse.json({ success: true, request: result[0] }, { status: 201 })
  } catch (error) {
    console.error('Error saving request:', error)
    return NextResponse.json(
      { error: 'Failed to save request', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const allRequests = await db.select().from(access_requests)
    return NextResponse.json({ requests: allRequests })
  } catch (error) {
    console.error('Error fetching requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}
