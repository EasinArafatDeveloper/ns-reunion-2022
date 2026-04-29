'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Clock, 
  MapPin, 
  X,
  Save,
  Loader2,
  Camera,
  Image as ImageIcon
} from 'lucide-react';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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
    description: '',
    category: 'REUNION',
    image: '', // Base64 string
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire('Error', 'Image size should be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

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
        Swal.fire('Success', `Event ${editingEvent ? 'updated' : 'published'}!`, 'success');
        setShowModal(false);
        setEditingEvent(null);
        setFormData({ title: '', date: '', time: '', location: '', description: '', category: 'REUNION', image: '' });
        fetchEvents();
      }
    } catch (error) {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Delete this event?',
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
      description: event.description,
      category: event.category,
      image: event.image
    });
    setShowModal(true);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary mb-2">Event Management</h1>
          <p className="text-gray-500 font-bold">Create and organize reunion events.</p>
        </div>
        <button 
          onClick={() => { setEditingEvent(null); setFormData({ title: '', date: '', time: '', location: '', description: '', category: 'REUNION', image: '' }); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary rounded-2xl font-black hover:bg-opacity-90 transition-all shadow-xl shadow-secondary/20"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-secondary" />
            <span className="text-gray-400 font-bold">Loading events...</span>
          </div>
        ) : events.map((event) => (
          <motion.div 
            key={event._id}
            layout
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all"
          >
            <div className="h-48 overflow-hidden relative">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
                {event.category}
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-primary mb-4 truncate">{event.title}</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-400 text-sm font-bold">
                  <Calendar className="w-4 h-4 text-secondary" /> {event.date}
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm font-bold">
                  <MapPin className="w-4 h-4 text-secondary" /> {event.location}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(event)} className="flex-1 p-3 bg-gray-50 rounded-xl text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-sm">
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => handleDelete(event._id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-4xl rounded-[3rem] p-8 shadow-2xl relative overflow-y-auto max-h-[95vh]"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-black text-primary mb-8">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Title</label>
                      <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold">
                          <option value="REUNION">REUNION</option>
                          <option value="CEREMONY">CEREMONY</option>
                          <option value="CULTURAL">CULTURAL</option>
                          <option value="SPORTS">SPORTS</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                        <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                        <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                        <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Image</label>
                      <div className="relative group">
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className={`w-full px-5 py-4 bg-gray-50 border-2 border-dashed ${formData.image ? 'border-green-400' : 'border-gray-200'} rounded-[1.2rem] flex items-center justify-center gap-3 text-gray-400 group-hover:border-primary transition-all`}>
                          <Camera className={`w-5 h-5 ${formData.image ? 'text-green-500' : ''}`} />
                          <span className={`font-bold ${formData.image ? 'text-green-600' : ''}`}>
                            {formData.image ? 'Image Selected' : 'Upload Image'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 flex flex-col h-full">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Description</label>
                    <div className="flex-1 min-h-[300px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 quill-wrapper">
                      <ReactQuill 
                        theme="snow" 
                        value={formData.description} 
                        onChange={(val) => setFormData({...formData, description: val})}
                        modules={quillModules}
                        className="h-full"
                      />
                    </div>
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

      <style jsx global>{`
        .quill-wrapper .ql-container {
          border: none !important;
          height: calc(100% - 42px);
          font-family: inherit;
        }
        .quill-wrapper .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background: #fff;
        }
        .quill-wrapper .ql-editor {
          font-size: 16px;
          line-height: 1.6;
          color: #1a1a54;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default EventsAdmin;
