'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Bell, 
  X,
  Save,
  Loader2,
  Megaphone
} from 'lucide-react';

const NoticesAdmin = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    category: 'GENERAL',
    isNew: true,
    hasAttachment: false
  });

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/admin/notices');
      const data = await res.json();
      setNotices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingNotice ? 'PUT' : 'POST';
    const body = editingNotice ? { ...formData, id: editingNotice._id } : formData;

    try {
      const res = await fetch('/api/admin/notices', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        Swal.fire('Success', `Notice ${editingNotice ? 'updated' : 'published'}!`, 'success');
        setShowModal(false);
        setEditingNotice(null);
        setFormData({ title: '', date: '', description: '', category: 'GENERAL', isNew: true, hasAttachment: false });
        fetchNotices();
      }
    } catch (error) {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Delete this notice?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a1a54',
      cancelButtonColor: '#ff8c00',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`/api/admin/notices?id=${id}`, { method: 'DELETE' });
        fetchNotices();
        Swal.fire('Deleted!', 'Notice removed.', 'success');
      }
    });
  };

  const openEditModal = (notice: any) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      date: notice.date,
      description: notice.description,
      category: notice.category,
      isNew: notice.isNew,
      hasAttachment: notice.hasAttachment
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary mb-2">Notice Management</h1>
          <p className="text-gray-500 font-bold">Post announcements and updates for participants.</p>
        </div>
        <button 
          onClick={() => { setEditingNotice(null); setFormData({ title: '', date: '', description: '', category: 'GENERAL', isNew: true, hasAttachment: false }); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary rounded-2xl font-black hover:bg-opacity-90 transition-all shadow-xl shadow-secondary/20"
        >
          <Plus className="w-5 h-5" />
          <span>Post New Notice</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-secondary" />
            <span className="text-gray-400 font-bold">Loading notices...</span>
          </div>
        ) : notices.map((notice) => (
          <motion.div 
            key={notice._id}
            layout
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row gap-6 items-start md:items-center group"
          >
            <div className="p-5 bg-primary/5 rounded-[1.5rem] text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Megaphone className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-black text-secondary tracking-widest uppercase">{notice.category}</span>
                <span className="text-[10px] font-bold text-gray-400">{notice.date}</span>
                {notice.isNew && <span className="bg-green-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">New</span>}
              </div>
              <h3 className="text-xl font-bold text-primary">{notice.title}</h3>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => openEditModal(notice)} className="flex-1 md:flex-none p-4 bg-gray-50 rounded-2xl text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-sm">
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => handleDelete(notice._id)} className="flex-1 md:flex-none p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-sm">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
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
              <h2 className="text-2xl font-black text-primary mb-8">{editingNotice ? 'Edit Notice' : 'Post New Notice'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notice Title</label>
                    <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold">
                        <option value="GENERAL">GENERAL</option>
                        <option value="IMPORTANT">IMPORTANT</option>
                        <option value="URGENT">URGENT</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                      <input value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} placeholder="Oct 31, 2026" required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notice Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold resize-none" />
                  </div>
                  <div className="flex gap-8">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={formData.isNew} onChange={e => setFormData({...formData, isNew: e.target.checked})} className="w-5 h-5 rounded-md accent-secondary" />
                      <span className="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">Mark as New</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={formData.hasAttachment} onChange={e => setFormData({...formData, hasAttachment: e.target.checked})} className="w-5 h-5 rounded-md accent-secondary" />
                      <span className="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">Has Attachment</span>
                    </label>
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-primary/10">
                  <Save className="w-5 h-5 text-secondary" />
                  <span>{editingNotice ? 'Update Notice' : 'Post Notice'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoticesAdmin;
