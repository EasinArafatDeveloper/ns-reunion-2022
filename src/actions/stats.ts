'use server';

import connectToDatabase from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function getDashboardStats() {
  try {
    await connectToDatabase();
    const registrations = await Registration.find({});
    
    let total = registrations.length;
    let revenue = 0;
    let approved = 0;
    let pending = 0;

    registrations.forEach((reg) => {
      revenue += Number(reg.amount) || 0;
      if (reg.status === 'approved') approved++;
      if (reg.status === 'pending') pending++;
    });

    return { total, revenue, approved, pending };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { total: 0, revenue: 0, approved: 0, pending: 0 };
  }
}

export async function getPublicStats() {
  try {
    await connectToDatabase();
    const count = await Registration.countDocuments({});
    return { registeredMembers: count };
  } catch (error) {
    console.error('Error fetching public stats:', error);
    return { registeredMembers: 0 };
  }
}
