import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
) {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}

export async function sendRequestConfirmationEmail(userEmail: string, projectTitle: string) {
  const html = `
    <h2>Access Request Received</h2>
    <p>Thank you for your interest in <strong>${projectTitle}</strong>.</p>
    <p>We have received your access request and will review it shortly.</p>
  `
  return sendEmail(userEmail, `Access Request Received - ${projectTitle}`, html)
}

export async function sendAdminNotification(projectTitle: string, adminEmail: string) {
  const html = `
    <h2>New Access Request</h2>
    <p>You have received a new access request for <strong>${projectTitle}</strong>.</p>
    <p>Please review and approve or reject the request in your admin dashboard.</p>
  `
  return sendEmail(adminEmail, `New Access Request - ${projectTitle}`, html)
}

export async function sendApprovalEmail(userEmail: string, projectTitle: string) {
  const html = `
    <h2>Access Granted</h2>
    <p>Your access request for <strong>${projectTitle}</strong> has been approved!</p>
  `
  return sendEmail(userEmail, `Access Granted - ${projectTitle}`, html)
}
