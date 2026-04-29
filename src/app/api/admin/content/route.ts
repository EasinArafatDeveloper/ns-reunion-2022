import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WebsiteContent from '@/models/WebsiteContent';

export async function GET() {
  try {
    await connectToDatabase();
    const contents = await WebsiteContent.find();
    return NextResponse.json(contents);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching content' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { key, value } = await req.json();
    const content = await WebsiteContent.findOneAndUpdate(
      { key },
      { value, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating content' }, { status: 500 });
  }
}
