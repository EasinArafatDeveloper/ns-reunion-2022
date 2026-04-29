'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { motion } from 'framer-motion';
import { Bell, FileText, Download, Calendar, ExternalLink, Megaphone, Loader2 } from 'lucide-react';

const NoticesPage = () => {
  const { language } = useLanguage();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchNotices();
  }, []);

  return (
    <main className={`min-h-screen bg-[#F8FAFC] ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>
      <Navbar />
      
      <section className="relative pt-32 pb-24 bg-primary overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/10 skew-x-12 transform translate-x-1/2" />
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 text-secondary rounded-full mb-6 border border-secondary/20">
              <Bell className="w-4 h-4" />
              <span className="text-xs font-black tracking-widest uppercase">{language === 'bn' ? 'নোটিশ বোর্ড' : 'NOTICE BOARD'}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              {language === 'bn' ? 'গুরুত্বপূর্ণ ঘোষণাসমূহ' : 'Latest Announcements'}
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-20 max-w-[1200px] mx-auto px-4 md:px-8">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-secondary" />
            <span className="text-gray-400 font-bold">Loading notices...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {notices.length === 0 ? (
              <div className="py-20 text-center text-gray-400 font-bold italic">
                {language === 'bn' ? 'কোনো নোটিশ পাওয়া যায়নি।' : 'No notices found.'}
              </div>
            ) : notices.map((notice, index) => (
              <motion.div key={notice._id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all group relative overflow-hidden">
                {notice.isNew && <div className="absolute top-0 right-0"><div className="bg-secondary text-white text-[10px] font-black px-10 py-1 rotate-45 translate-x-8 translate-y-3 shadow-md">NEW</div></div>}
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="p-5 bg-primary/5 rounded-[1.5rem] group-hover:bg-primary group-hover:text-white transition-colors">
                    <Megaphone className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="flex items-center gap-1.5 text-secondary text-xs font-bold bg-secondary/5 px-3 py-1 rounded-full"><Calendar className="w-3.5 h-3.5" />{notice.date}</span>
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{notice.category}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-primary transition-colors">{notice.title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed max-w-3xl">{notice.description}</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    {notice.hasAttachment ? (
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary text-white rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-secondary/20"><Download className="w-4 h-4" /><span>{language === 'bn' ? 'ডাউনলোড' : 'Download'}</span></button>
                    ) : (
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-primary/5 text-primary rounded-2xl font-bold hover:bg-gray-50 transition-all"><ExternalLink className="w-4 h-4" /><span>{language === 'bn' ? 'বিস্তারিত' : 'View Detail'}</span></button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default NoticesPage;
