import nodemailer from 'nodemailer'
import VerificationEmail from "@/emails/verificationEmail"
import { ApiResponse } from '../types/ApiResponse'  
import { render } from '@react-email/render'

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifycode: string,
): Promise<ApiResponse> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Convert React Email → HTML
    const emailHtml = await render(
      <VerificationEmail username={username} otp={verifycode} />
    )

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Mystry message | Verification code',
      html: emailHtml
    })

    return {
      success: true,
      message: 'Verification email sent',
    }
  } catch (error) {
    console.error('Email send error:', error)
    return {
      success: false,
      message: 'Failed to send verification email',
    }
  }
} 
