'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Save, 
  Clock, 
  Calendar,
  Loader2,
  MapPin,
  Sparkles,
  Camera,
  Layout
} from 'lucide-react';

const ContentAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reunionDate, setReunionDate] = useState('');
  const [reunionTime, setReunionTime] = useState('');
  
  // Featured Event Settings
  const [featuredEvent, setFeaturedEvent] = useState({
    title_bn: '',
    title_en: '',
    location_bn: '',
    location_en: '',
    date_bn: '',
    date_en: '',
    image: ''
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      
      // Global Date
      const dateSetting = data.find((c: any) => c.key === 'reunion_date');
      if (dateSetting) {
        const dt = new Date(dateSetting.value);
        setReunionDate(dt.toISOString().split('T')[0]);
        setReunionTime(dt.toTimeString().split(' ')[0].substring(0, 5));
      }

      // Featured Event
      const feSetting = data.find((c: any) => c.key === 'featured_event');
      if (feSetting) {
        setFeaturedEvent(JSON.parse(feSetting.value));
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

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
    } catch (error) {
      throw error;
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Save Global Date
      const fullDateTime = `${reunionDate}T${reunionTime}:00`;
      await handleUpdateSetting('reunion_date', fullDateTime);
      
      // Save Featured Event
      await handleUpdateSetting('featured_event', JSON.stringify(featuredEvent));
      
      Swal.fire('Success', 'Settings updated successfully!', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire('Error', 'Image size should be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedEvent({ ...featuredEvent, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-primary mb-2 tracking-tight">Website Content Management</h1>
          <p className="text-gray-500 font-bold">Manage global configurations, timers, and featured sections.</p>
        </div>
        <button 
          onClick={handleSaveAll}
          disabled={saving}
          className="px-10 py-4 bg-primary text-white rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 text-secondary" />}
          <span>Save All Changes</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-secondary" />
          <span className="text-gray-400 font-bold">Loading configurations...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Main Event Timer Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-primary/5 h-fit"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-secondary/10 rounded-2xl">
                <Clock className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h2 className="text-xl font-black text-primary">Main Event Timer</h2>
                <p className="text-sm text-gray-400 font-bold">Global countdown target date.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Date</label>
                <div className="relative">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="date" value={reunionDate} onChange={e => setReunionDate(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Time</label>
                <div className="relative">
                  <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="time" value={reunionTime} onChange={e => setReunionTime(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Featured Event Card Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-primary/5 h-fit"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-primary/5 rounded-2xl">
                <Layout className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-black text-primary">Featured Event Card</h2>
                <p className="text-sm text-gray-400 font-bold">Edit the main event card on home page.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title (Bangla)</label>
                  <input value={featuredEvent.title_bn} onChange={e => setFeaturedEvent({...featuredEvent, title_bn: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" placeholder="যেমন: রিইউনিয়ন ২.০" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title (English)</label>
                  <input value={featuredEvent.title_en} onChange={e => setFeaturedEvent({...featuredEvent, title_en: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" placeholder="e.g. Reunion 2.0" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location (Bangla)</label>
                  <input value={featuredEvent.location_bn} onChange={e => setFeaturedEvent({...featuredEvent, location_bn: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location (English)</label>
                  <input value={featuredEvent.location_en} onChange={e => setFeaturedEvent({...featuredEvent, location_en: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date String (Bangla)</label>
                  <input value={featuredEvent.date_bn} onChange={e => setFeaturedEvent({...featuredEvent, date_bn: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" placeholder="যেমন: ৩১শে ডিসেম্বর, ২০২৬" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date String (English)</label>
                  <input value={featuredEvent.date_en} onChange={e => setFeaturedEvent({...featuredEvent, date_en: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" placeholder="e.g. Dec 31, 2026" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cover Image</label>
                <div className="relative group h-40">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className={`w-full h-full bg-gray-50 border-2 border-dashed ${featuredEvent.image ? 'border-green-400' : 'border-gray-200'} rounded-[1.5rem] flex flex-col items-center justify-center gap-2 group-hover:border-primary transition-all overflow-hidden`}>
                    {featuredEvent.image ? (
                      <img src={featuredEvent.image} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Cover Image</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      )}
    </div>
  );
};

export default ContentAdmin;
