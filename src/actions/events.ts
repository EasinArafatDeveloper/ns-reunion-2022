'use server';

import connectToDatabase from '@/lib/mongodb';
import Event from '@/models/Event';

export async function getEventById(id: string) {
  try {
    await connectToDatabase();
    const event = await Event.findById(id);
    if (!event) return null;
    
    // We need to parse it to JSON to pass from server to client safely
    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.error('Error fetching event by id:', error);
    return null;
  }
}
