'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  MapPin, 
  Clock, 
  Image as ImageIcon,
  X,
  Save,
  Loader2
} from 'lucide-react';

const EventsAdmin = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'REUNION',
    image: '',
    description: '',
    isOpen: true
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingEvent ? 'PUT' : 'POST';
    const body = editingEvent ? { ...formData, id: editingEvent._id } : formData;

    try {
      const res = await fetch('/api/admin/events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        Swal.fire('Success', `Event ${editingEvent ? 'updated' : 'created'}!`, 'success');
        setShowModal(false);
        setEditingEvent(null);
        setFormData({ title: '', date: '', time: '', location: '', category: 'REUNION', image: '', description: '', isOpen: true });
        fetchEvents();
      }
    } catch (error) {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a1a54',
      cancelButtonColor: '#ff8c00',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
        fetchEvents();
        Swal.fire('Deleted!', 'Event removed.', 'success');
      }
    });
  };

  const openEditModal = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      image: event.image,
      description: event.description || '',
      isOpen: event.isOpen
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary mb-2">Events Management</h1>
          <p className="text-gray-500 font-bold">Create and manage upcoming programs.</p>
        </div>
        <button 
          onClick={() => { setEditingEvent(null); setFormData({ title: '', date: '', time: '', location: '', category: 'REUNION', image: '', description: '', isOpen: true }); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary rounded-2xl font-black hover:bg-opacity-90 transition-all shadow-xl shadow-secondary/20"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-secondary" />
            <span className="text-gray-400 font-bold">Loading events...</span>
          </div>
        ) : events.map((event) => (
          <motion.div 
            key={event._id}
            layout
            className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="relative h-48">
              <img src={event.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => openEditModal(event)} className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-primary hover:bg-white transition-all shadow-sm">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(event._id)} className="p-2 bg-red-500/90 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-all shadow-sm">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <span className="text-[10px] font-black text-secondary tracking-widest uppercase mb-2 block">{event.category}</span>
              <h3 className="text-xl font-bold text-primary mb-4">{event.title}</h3>
              <div className="space-y-2 text-sm text-gray-500 font-bold">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-secondary" /> {event.date}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-secondary" /> {event.location}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-black text-primary mb-8">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Title</label>
                    <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold">
                      <option value="REUNION">REUNION</option>
                      <option value="CULTURAL">CULTURAL</option>
                      <option value="MEETUP">MEETUP</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                    <input value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} placeholder="Dec 31, 2026" required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                    <input value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} placeholder="06:00 PM" required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                    <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold resize-none" />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-primary/10">
                  <Save className="w-5 h-5 text-secondary" />
                  <span>{editingEvent ? 'Update Event' : 'Publish Event'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsAdmin;
