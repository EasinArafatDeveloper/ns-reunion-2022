import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Registration from '@/models/Registration';
import WebsiteContent from '@/models/WebsiteContent';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    
    // 1. Fetch Dynamic Event Date from WebsiteContent
    const dateSetting = await WebsiteContent.findOne({ key: 'reunion_date' });
    const targetDate = dateSetting ? new Date(dateSetting.value) : new Date("2026-12-31T23:59:59");
    const formattedDate = targetDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    // 2. Create new registration in MongoDB
    const newRegistration = await Registration.create(data);

    // 3. Setup Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 4. Calculate Countdown for Email
    const today = new Date();
    const diffTime = Math.abs(targetDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 40px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; }
          .hero { background: linear-gradient(135deg, #1a1a54 0%, #0f172a 100%); padding: 60px 40px; text-align: center; position: relative; }
          .hero::after { content: ''; position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: rgba(255,140,0,0.1); border-radius: 0 0 0 100%; }
          .logo-text { color: #ff8c00; font-weight: 900; letter-spacing: 5px; font-size: 14px; margin-bottom: 10px; display: block; }
          .headline { color: #ffffff; font-size: 36px; font-weight: 900; margin: 0; line-height: 1.2; }
          .content { padding: 50px 40px; color: #334155; }
          .user-name { color: #1a1a54; font-size: 24px; font-weight: 800; margin-bottom: 20px; }
          .details-card { background: #f8fafc; border-radius: 30px; padding: 30px; margin: 30px 0; border: 1px solid #e2e8f0; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #eef2f6; padding-bottom: 10px; }
          .detail-label { color: #64748b; font-weight: bold; font-size: 13px; text-transform: uppercase; }
          .detail-value { color: #1e293b; font-weight: 800; font-size: 15px; }
          .countdown-box { background: #fff7ed; border: 2px solid #ffedd5; border-radius: 30px; padding: 25px; text-align: center; margin-top: 40px; }
          .days-left { color: #ff8c00; font-size: 42px; font-weight: 900; display: block; line-height: 1; }
          .days-label { color: #9a3412; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
          .footer { background: #f1f5f9; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="hero">
            <span class="logo-text">NS UNITY FORUM</span>
            <h1 class="headline">WELCOME TO THE REUNION!</h1>
          </div>
          <div class="content">
            <h2 class="user-name">Hi ${data.name},</h2>
            <p style="font-size: 17px; line-height: 1.8; font-weight: 500;">
              Your spot is officially secured for the most anticipated event! We can't wait to see you back at the NS Reunion.
            </p>
            
            <div class="details-card">
              <div class="detail-row">
                <span class="detail-label">Reg ID</span>
                <span class="detail-value">#${newRegistration._id.toString().slice(-6).toUpperCase()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">T-shirt Size</span>
                <span class="detail-value">${data.tshirtSize}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment</span>
                <span class="detail-value" style="color: #f59e0b;">Verification Pending</span>
              </div>
            </div>

            <div class="countdown-box">
              <span class="days-left">${diffDays}</span>
              <span class="days-label">Days to the Grand Celebration</span>
              <p style="margin-top: 15px; color: #c2410c; font-size: 14px; font-weight: bold;">📅 Save the Date: ${formattedDate}</p>
            </div>

            <p style="margin-top: 40px; font-size: 15px; font-weight: 600; text-align: center; color: #64748b;">
              Please keep this email safe. Your entry pass will be generated once your payment is verified.
            </p>
          </div>
          <div class="footer">
            © 2026 NS UNITY FORUM • RECONNECTING MEMORIES
          </div>
        </div>
      </body>
      </html>
    `;

    // 5. Send Email
    await transporter.sendMail({
      from: `"NS Reunion" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `Registration Confirmed! - ${diffDays} Days Left`,
      html: emailHtml,
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful and dynamic email sent!',
      id: newRegistration._id 
    });
  } catch (error: any) {
    console.error('Registration/Email Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to submit registration' 
    }, { status: 500 });
  }
}
