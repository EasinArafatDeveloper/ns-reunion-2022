import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Notice from '@/models/Notice';

export async function GET() {
  try {
    await connectToDatabase();
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    return NextResponse.json(notices);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const newNotice = await Notice.create(data);
    return NextResponse.json(newNotice);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { id, ...updateData } = await req.json();
    const updated = await Notice.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  try {
    await connectToDatabase();
    await Notice.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 });
  }
}
