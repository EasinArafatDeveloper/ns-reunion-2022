import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

export async function GET() {
  try {
    await connectToDatabase();
    const images = await Gallery.find().sort({ createdAt: -1 });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching gallery' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const newImage = await Gallery.create(data);
    return NextResponse.json(newImage);
  } catch (error) {
    return NextResponse.json({ message: 'Error adding image' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await Gallery.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Image deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting image' }, { status: 500 });
  }
}
