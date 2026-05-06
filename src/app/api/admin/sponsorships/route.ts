import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Sponsorship from '@/models/Sponsorship';

export async function GET() {
  try {
    await connectToDatabase();
    const sponsorships = await Sponsorship.find({}).sort({ createdAt: -1 });
    return NextResponse.json(sponsorships);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sponsorships' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { id, status, ...updateData } = await req.json();
    const updated = await Sponsorship.findByIdAndUpdate(id, { status, ...updateData }, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update sponsorship' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    await connectToDatabase();
    await Sponsorship.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sponsorship' }, { status: 500 });
  }
}
