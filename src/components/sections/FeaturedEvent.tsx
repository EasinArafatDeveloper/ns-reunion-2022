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
            <div className="lg:col-span-5 relative h-[400px] lg:h-auto min-h-[500px] group">
              <img 
                src={data.image || '/reunion_kuakata_cover.png'} 
                alt="Featured Event"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 via-primary/20 to-transparent" />
              
              {/* Reference Style Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-12 select-none">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-0"
                >
                  <p className="text-white text-2xl md:text-4xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-1">
                    {language === 'bn' ? 'স্মৃতির' : 'Memories of'}
                  </p>
                  <h3 className="text-secondary text-5xl md:text-7xl font-black drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)] uppercase tracking-tighter leading-none mb-2">
                    {language === 'bn' ? (data.location_bn.split(' ')[0]) : (data.location_en.split(' ')[0])}
                  </h3>
                  <div className="flex justify-end w-full">
                    <p className="text-white text-3xl md:text-5xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                      {language === 'bn' ? data.title_bn : data.title_en}
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="absolute top-8 left-8">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2 shadow-lg">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    {language === 'bn' ? 'আসন্ন মূল অনুষ্ঠান' : 'Upcoming Main Event'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Content */}
            <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-lg text-primary font-black text-[10px] tracking-widest uppercase mb-6">
                  <Sparkles className="w-3 h-3 text-secondary" />
                  {language === 'bn' ? data.title_bn : data.title_en}
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-primary mb-8 leading-tight">
                  {language === 'bn' 
                    ? `${data.location_bn} এ আবার দেখা হবে বন্ধুদের সাথে` 
                    : `Meeting friends again at the shores of ${data.location_en}`}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        {language === 'bn' ? 'ভেন্যু' : 'Location'}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {language === 'bn' ? data.location_bn : data.location_en}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        {language === 'bn' ? 'তারিখ' : 'Date'}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {language === 'bn' ? data.date_bn : data.date_en}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link href="/register" className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 w-full"
                    >
                      <span>{language === 'bn' ? 'রেজিস্ট্রেশন করুন' : 'Register Now'}</span>
                      <ArrowRight className="w-6 h-6 text-secondary" />
                    </motion.button>
                  </Link>
                  
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-md">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                      </div>
                    ))}
                    <div className="h-10 px-3 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-primary text-[10px] font-black shadow-md">
                      +1.2k
                    </div>
                  </div>
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
