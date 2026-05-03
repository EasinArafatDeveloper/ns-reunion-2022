'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../providers/LanguageProvider';
import { X, Maximize2, Loader2, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const { language } = useLanguage();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
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
    fetchGallery();
  }, []);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % images.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + images.length) % images.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16">
        
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-primary font-black text-[10px] tracking-widest uppercase mb-4"
          >
            <ImageIcon className="w-4 h-4 text-secondary" />
            {language === 'bn' ? 'স্মৃতিচারণ' : 'Memories'}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-6"
          >
            {language === 'bn' ? 'স্মৃতির মণিকোঠায়' : 'Memory Lane'}
          </motion.h2>
          <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full" />
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-secondary" />
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Memories...</span>
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {images.map((img, idx) => (
                <motion.div
                  key={img._id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="relative group cursor-pointer break-inside-avoid rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all"
                  onClick={() => setSelectedIdx(idx)}
                >
                  <img 
                    src={img.image} 
                    alt={img.title}
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <p className="text-[10px] font-black text-secondary tracking-widest uppercase mb-1">{img.category}</p>
                        <h4 className="text-white font-bold text-lg">{img.title}</h4>
                      </div>
                      <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                <ImageIcon className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">
                  {language === 'bn' ? 'গ্যালারিতে এখনও কোনো ছবি নেই' : 'No photos available yet'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-primary/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedIdx(null)}
          >
            <button className="absolute top-8 right-8 p-4 text-white hover:text-secondary transition-colors z-30">
              <X className="w-10 h-10" />
            </button>

            <button 
              onClick={handlePrev}
              className="absolute left-4 md:left-10 p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center gap-8"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={images[selectedIdx].image} 
                alt={images[selectedIdx].title}
                className="max-h-[80vh] w-auto object-contain rounded-[2rem] shadow-2xl border-4 border-white/10"
              />
              <div className="text-center">
                <span className="text-secondary font-black tracking-widest text-[10px] uppercase block mb-2">{images[selectedIdx].category}</span>
                <h3 className="text-3xl font-black text-white">{images[selectedIdx].title}</h3>
              </div>
            </motion.div>

            <button 
              onClick={handleNext}
              className="absolute right-4 md:right-10 p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
