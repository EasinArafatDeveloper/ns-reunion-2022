'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ImageIcon, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const photos = [
    {
      src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
      title: language === 'bn' ? 'মেইন স্টেজ' : 'Main Stage'
    },
    {
      src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
      title: language === 'bn' ? 'গ্রুপ ফটো' : 'Group Photo'
    },
    {
      src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
      title: language === 'bn' ? 'সাংস্কৃতিক অনুষ্ঠান' : 'Cultural Show'
    },
    {
      src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop',
      title: language === 'bn' ? 'স্মৃতিচারণ' : 'Reminiscing'
    },
    {
      src: 'https://images.unsplash.com/photo-1505232458567-cc2648506317?q=80&w=800&auto=format&fit=crop',
      title: language === 'bn' ? 'ডিনার টাইম' : 'Dinner Time'
    },
    {
      src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&auto=format&fit=crop',
      title: language === 'bn' ? 'পুরানো বন্ধুদের আড্ডা' : 'Old Friends Chat'
    }
  ];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % photos.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + photos.length) % photos.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary font-bold text-xs mb-4"
          >
            <ImageIcon className="w-4 h-4" />
            <span>{language === 'bn' ? 'গ্যালারি' : 'GALLERY'}</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-primary mb-6"
          >
            {language === 'bn' ? 'স্মৃতির মণিকোঠায়' : 'In the Corner of Memories'}
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1.5 bg-secondary mx-auto rounded-full mb-6"
          />
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedImage(index)}
              className="relative group rounded-[2.5rem] overflow-hidden cursor-pointer shadow-xl shadow-primary/5"
            >
              <img 
                src={photo.src} 
                alt={photo.title}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-black text-xl mb-1">{photo.title}</p>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                      {language === 'bn' ? 'রিইউনিয়ন ২০২২' : 'Reunion 2022'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-secondary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/40">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/95 backdrop-blur-xl p-4 md:p-10"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors z-10"
              >
                <X className="w-8 h-8" />
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
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-6"
              >
                <img
                  src={photos[selectedImage].src}
                  alt={photos[selectedImage].title}
                  className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl"
                />
                <div className="text-center">
                  <h3 className="text-white text-3xl font-black mb-2">{photos[selectedImage].title}</h3>
                  <p className="text-white/60 font-bold tracking-widest uppercase text-sm">
                    {language === 'bn' ? 'ছবি' : 'Photo'} {selectedImage + 1} / {photos.length}
                  </p>
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

        <div className="mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 border-2 border-primary/10 text-primary font-black rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            {language === 'bn' ? 'সব ছবি দেখুন' : 'View All Memories'}
          </motion.button>
        </div>

      </div>
    </section>
  );
};

export default Gallery;
