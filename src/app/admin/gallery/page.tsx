'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Plus, 
  Trash2, 
  Camera, 
  X,
  Save,
  Loader2,
  Image as ImageIcon,
  Grid
} from 'lucide-react';

const GalleryAdmin = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'REUNION 2022',
    image: '',
  });

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
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
    if (!formData.image) {
      Swal.fire('Error', 'Please select an image', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        Swal.fire('Success', 'Photo added to gallery!', 'success');
        setShowModal(false);
        setFormData({ title: '', category: 'REUNION 2022', image: '' });
        fetchImages();
      }
    } catch (error) {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Delete this photo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a1a54',
      cancelButtonColor: '#ff8c00',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
        fetchImages();
        Swal.fire('Deleted!', 'Photo removed.', 'success');
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary mb-2">Gallery Management</h1>
          <p className="text-gray-500 font-bold">Manage your reunion memories and event photos.</p>
        </div>
        <button 
          onClick={() => { setFormData({ title: '', category: 'REUNION 2022', image: '' }); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary rounded-2xl font-black hover:bg-opacity-90 transition-all shadow-xl shadow-secondary/20"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Photo</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-secondary" />
          <span className="text-gray-400 font-bold">Loading gallery...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <motion.div 
              key={img._id}
              layout
              className="relative aspect-square rounded-[2rem] overflow-hidden group border border-gray-100 shadow-sm"
            >
              <img src={img.image} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                <p className="text-white font-bold text-sm mb-4">{img.title}</p>
                <button 
                  onClick={() => handleDelete(img._id)}
                  className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
          {images.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
              <ImageIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">No photos in gallery yet.</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg rounded-[3rem] p-8 shadow-2xl relative"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-black text-primary mb-8">Add Photo</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Photo Title</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" placeholder="e.g. Group Photo" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Upload Photo</label>
                  <div className="relative group">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {formData.image ? (
                      <div className="relative rounded-2xl overflow-hidden aspect-video">
                        <img src={formData.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full px-5 py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[1.2rem] flex flex-col items-center justify-center gap-3 text-gray-400 group-hover:border-primary transition-all">
                        <Camera className="w-8 h-8" />
                        <span className="font-bold uppercase text-[10px] tracking-widest">Select Image File</span>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-primary/10">
                  <Save className="w-5 h-5 text-secondary" />
                  <span>Upload to Gallery</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryAdmin;
