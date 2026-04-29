import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function GET() {
  try {
    await connectToDatabase();
    const registrations = await Registration.find({}).sort({ createdAt: -1 });
    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { id, status, ...updateData } = await req.json();
    const updated = await Registration.findByIdAndUpdate(id, { status, ...updateData }, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    await connectToDatabase();
    await Registration.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 });
  }
}
