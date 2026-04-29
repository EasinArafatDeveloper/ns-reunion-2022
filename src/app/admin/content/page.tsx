'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Save, 
  Clock, 
  Calendar,
  Loader2,
  Settings
} from 'lucide-react';

const ContentAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reunionDate, setReunionDate] = useState('');
  const [reunionTime, setReunionTime] = useState('');

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      const dateSetting = data.find((c: any) => c.key === 'reunion_date');
      if (dateSetting) {
        const dt = new Date(dateSetting.value);
        setReunionDate(dt.toISOString().split('T')[0]);
        setReunionTime(dt.toTimeString().split(' ')[0].substring(0, 5));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdateDate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fullDateTime = `${reunionDate}T${reunionTime}:00`;

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'reunion_date', value: fullDateTime })
      });
      if (res.ok) {
        Swal.fire('Success', 'Global Reunion Date updated!', 'success');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-primary mb-2">Website Settings</h1>
        <p className="text-gray-500 font-bold">Manage global configurations and event schedules.</p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-secondary" />
          <span className="text-gray-400 font-bold">Loading settings...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {/* Reunion Countdown Setting */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-primary/5"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-secondary/10 rounded-2xl">
                <Clock className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h2 className="text-xl font-black text-primary">Main Event Countdown</h2>
                <p className="text-sm text-gray-400 font-bold">Change the target date for the global timer.</p>
              </div>
            </div>

            <form onSubmit={handleUpdateDate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="date" 
                      value={reunionDate}
                      onChange={(e) => setReunionDate(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Time</label>
                  <div className="relative">
                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="time" 
                      value={reunionTime}
                      onChange={(e) => setReunionTime(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/5">
                <p className="text-sm text-primary/60 font-bold leading-relaxed">
                  <span className="text-primary font-black">Note:</span> Changing this will update the countdown on the Landing Page and in automated registration emails instantly.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={saving}
                className="w-full md:w-auto px-12 py-5 bg-primary text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 text-secondary" />}
                <span>Save Changes</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContentAdmin;
