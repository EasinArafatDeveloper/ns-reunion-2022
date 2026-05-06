'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import Link from 'next/link';

const FeaturedEvent = () => {
  const { language } = useLanguage();
  const [data, setData] = useState({
    title_bn: 'রিইউনিয়ন ২.০',
    title_en: 'Reunion 2.0',
    location_bn: 'কুয়াকাটা সমুদ্রসৈকত',
    location_en: 'Kuakata Sea Beach',
    date_bn: '৩১শে ডিসেম্বর, ২০২৬',
    date_en: 'December 31, 2026',
    image: '/reunion_kuakata_cover.png'
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/admin/content');
        const content = await res.json();
        const fe = content.find((c: any) => c.key === 'featured_event');
        if (fe) {
          setData(JSON.parse(fe.value));
        }
      } catch (error) {
        console.error('Failed to fetch featured event content', error);
      }
    };
    fetchContent();
  }, []);

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white rounded-[3.5rem] overflow-hidden shadow-2xl shadow-primary/5 border border-gray-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Side: Cover Image with Text Overlay */}
            <div className="lg:col-span-5 relative h-[280px] sm:h-[350px] lg:h-auto lg:min-h-[500px] group overflow-hidden">
              <img 
                src={data.image || '/reunion_kuakata_cover.png'} 
                alt="Featured Event"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/70 via-primary/30 to-transparent" />
              
              {/* Reference Style Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-start justify-center p-6 sm:p-8 lg:p-12 select-none">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-0"
                >
                  <p className="text-white text-lg sm:text-2xl lg:text-4xl font-black drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] mb-1">
                    {language === 'bn' ? 'স্মৃতির' : 'Memories of'}
                  </p>
                  <h3 className="text-secondary text-4xl sm:text-5xl lg:text-7xl font-black drop-shadow-[0_6px_6px_rgba(0,0,0,0.5)] uppercase tracking-tighter leading-none mb-1 lg:mb-2">
                    {language === 'bn' ? (data.location_bn.split(' ')[0]) : (data.location_en.split(' ')[0])}
                  </h3>
                  <div className="flex justify-end w-full">
                    <p className="text-white text-2xl sm:text-3xl lg:text-5xl font-black drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
                      {language === 'bn' ? data.title_bn : data.title_en}
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8">
                <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2 shadow-lg">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                  <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest">
                    {language === 'bn' ? 'আসন্ন মূল অনুষ্ঠান' : 'Upcoming Main Event'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Content */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-lg text-primary font-black text-[10px] tracking-widest uppercase mb-4 lg:mb-6">
                  <Sparkles className="w-3 h-3 text-secondary" />
                  {language === 'bn' ? data.title_bn : data.title_en}
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-primary mb-6 lg:mb-8 leading-tight">
                  {language === 'bn' 
                    ? `${data.location_bn} এ আবার দেখা হবে বন্ধুদের সাথে` 
                    : `Meeting friends again at the shores of ${data.location_en}`}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 lg:mb-12">
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        {language === 'bn' ? 'ভেন্যু' : 'Location'}
                      </p>
                      <p className="text-base sm:text-lg font-bold text-primary">
                        {language === 'bn' ? data.location_bn : data.location_en}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        {language === 'bn' ? 'তারিখ' : 'Date'}
                      </p>
                      <p className="text-base sm:text-lg font-bold text-primary">
                        {language === 'bn' ? data.date_bn : data.date_en}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link href="/register" className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.03, x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 sm:px-10 sm:py-5 bg-primary text-white rounded-2xl font-black text-lg sm:text-xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 w-full"
                    >
                      <span>{language === 'bn' ? 'রেজিস্ট্রেশন করুন' : 'Register Now'}</span>
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEvent;
