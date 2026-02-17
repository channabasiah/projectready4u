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

export async function sendPasswordResetEmail(userEmail: string, resetLink: string) {
  const html = `
    <h2>Password Reset Request</h2>
    <p>We received a request to reset your password. Click the link below to proceed:</p>
    <p><a href="${resetLink}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `
  return sendEmail(userEmail, 'Password Reset Request', html)
}

export async function sendPasswordChangedEmail(userEmail: string) {
  const html = `
    <h2>Password Changed Successfully</h2>
    <p>Your password has been successfully changed. If you didn't make this change, please contact support immediately.</p>
  `
  return sendEmail(userEmail, 'Password Changed Notification', html)
}
