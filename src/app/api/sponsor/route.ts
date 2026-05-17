import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Sponsorship from '@/models/Sponsorship';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    
    // Create new sponsorship in MongoDB
    const newSponsorship = await Sponsorship.create(data);

    // Setup Nodemailer Transporter if credentials exist (with 3-second strict timeout)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 40px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; }
              .hero { background: linear-gradient(135deg, #1a1a54 0%, #0f172a 100%); padding: 60px 40px; text-align: center; position: relative; }
              .logo-text { color: #ff8c00; font-weight: 900; letter-spacing: 5px; font-size: 14px; margin-bottom: 10px; display: block; }
              .headline { color: #ffffff; font-size: 32px; font-weight: 900; margin: 0; line-height: 1.2; }
              .content { padding: 50px 40px; color: #334155; }
              .user-name { color: #1a1a54; font-size: 24px; font-weight: 800; margin-bottom: 20px; }
              .details-card { background: #f8fafc; border-radius: 30px; padding: 30px; margin: 30px 0; border: 1px solid #e2e8f0; }
              .detail-row { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #eef2f6; padding-bottom: 10px; }
              .detail-label { color: #64748b; font-weight: bold; font-size: 13px; text-transform: uppercase; }
              .detail-value { color: #1e293b; font-weight: 800; font-size: 15px; }
              .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="hero">
                <span class="logo-text">NS UNITY FORUM</span>
                <h1 class="headline">THANK YOU FOR YOUR SPONSORSHIP!</h1>
              </div>
              <div class="content">
                <h2 class="user-name">Hi ${data.name},</h2>
                <p style="font-size: 17px; line-height: 1.8; font-weight: 500;">
                  We are deeply grateful for your generous support of the NS Reunion. Your contribution helps make this historic reunion possible!
                </p>
                
                <div class="details-card">
                  <div class="detail-row">
                    <span class="detail-label">Sponsorship ID</span>
                    <span class="detail-value">#${newSponsorship._id.toString().slice(-6).toUpperCase()}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Sponsorship Amount</span>
                    <span class="detail-value">৳ ${data.amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Payment System</span>
                    <span class="detail-value uppercase">${data.paymentSystem}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Payment Status</span>
                    <span class="detail-value" style="color: #f59e0b;">Verification Pending</span>
                  </div>
                </div>

                <p style="margin-top: 40px; font-size: 15px; font-weight: 600; text-align: center; color: #64748b;">
                  Our administrative team will review and verify your transaction ID shortly. Thank you once again for your incredible gesture!
                </p>
              </div>
              <div class="footer">
                © 2026 NS UNITY FORUM • RECONNECTING MEMORIES
              </div>
            </div>
          </body>
          </html>
        `;

        console.log(`Attempting to send sponsorship email to ${data.email} with 3s timeout...`);

        await Promise.race([
          transporter.sendMail({
            from: `"NS Reunion" <${process.env.EMAIL_USER}>`,
            to: data.email,
            subject: `Thank you for your Sponsorship! - NS Reunion`,
            html: emailHtml,
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('SMTP email sending timed out after 3000ms')), 3000)
          )
        ]);

        console.log(`Sponsorship email successfully sent to ${data.email}`);
      } catch (emailErr: any) {
        console.error('Sponsorship Email Error (Gracefully handled):', emailErr.message || emailErr);
      }
    } else {
      console.warn('WARNING: EMAIL_USER or EMAIL_PASS environment variables are missing. Sponsorship email skipped.');
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sponsorship submitted successfully!',
      id: newSponsorship._id 
    });
  } catch (error: any) {
    console.error('Sponsorship Submission Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to submit sponsorship' 
    }, { status: 500 });
  }
}
