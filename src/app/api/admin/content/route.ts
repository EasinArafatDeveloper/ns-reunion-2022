import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WebsiteContent from '@/models/WebsiteContent';
// import { getServerSession } from 'next-auth'; // Add auth check later

export async function GET() {
  try {
    await connectDB();
    let content = await WebsiteContent.findOne().sort({ createdAt: -1 });
    
    if (!content) {
      // Return default structure if empty
      return NextResponse.json({ 
        hero: { title: { en: "", bn: "" }, subtitle: { en: "", bn: "" } },
        event: { details: { en: "", bn: "" } },
        notice: { en: "", bn: "" },
        formLabels: {
          name: { en: "", bn: "" },
          email: { en: "", bn: "" },
          phone: { en: "", bn: "" },
          batch: { en: "", bn: "" },
          submit: { en: "", bn: "" },
        },
        gallery: { title: { en: "", bn: "" } },
        footer: { text: { en: "", bn: "" } },
        emailTemplates: {
          registrationSubject: { en: "", bn: "" },
          registrationBody: { en: "", bn: "" },
        }
      });
    }
    
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Update or create content
    const content = await WebsiteContent.findOneAndUpdate(
      {}, // Single document for now
      body,
      { upsert: true, new: true }
    );
    
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
