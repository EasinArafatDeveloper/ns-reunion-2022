'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Registrations', value: '1,248', icon: Users, color: 'bg-blue-500' },
    { label: 'Total Revenue', value: '৳ 62,400', icon: CreditCard, color: 'bg-green-500' },
    { label: 'Approved', value: '942', icon: CheckCircle2, color: 'bg-emerald-500' },
    { label: 'Pending Approval', value: '106', icon: Clock, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-primary mb-3 tracking-tight">System Overview</h1>
          <p className="text-gray-400 font-bold text-lg max-w-lg leading-relaxed">
            Welcome to the NS Reunion 2022 command center. Monitor your event stats and manage participants from here.
          </p>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <div className="bg-primary text-white px-6 py-4 rounded-3xl flex items-center gap-3 shadow-xl shadow-primary/20">
            <Calendar className="w-6 h-6 text-secondary" />
            <span className="font-black text-xl">APRIL 29, 2026</span>
          </div>
        </div>
      </div>

      {/* Simplified Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 group hover:border-secondary transition-all"
          >
            <div className={`w-16 h-16 ${stat.color} rounded-2xl text-white shadow-lg flex items-center justify-center mb-8`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <p className="text-gray-400 font-black text-xs uppercase tracking-widest mb-2">{stat.label}</p>
            <h3 className="text-4xl font-black text-primary">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Quick Access Card */}
      <div className="bg-primary rounded-[4rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="text-3xl font-black mb-4">Need to update content?</h2>
            <p className="text-white/60 font-bold">Manage your events, notices, and gallery from the sidebar menu.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-8 py-4 bg-secondary text-primary rounded-2xl font-black shadow-lg">
              Admin Status: Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
