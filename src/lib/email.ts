import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const data = await resend.emails.send({
      from: 'Reunion 2022 <noreply@yourdomain.com>',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}
