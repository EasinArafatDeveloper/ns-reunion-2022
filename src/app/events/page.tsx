'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Filter, ChevronRight, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';

const EventsPage = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchEvents();
  }, []);

  const currentEvents = events.filter(event => {
    // Basic logic for demo: events before today are past, after are upcoming
    // In a real scenario, you might have an isPast field or compare dates
    const eventDate = new Date(event.date);
    const today = new Date();
    return activeTab === 'upcoming' ? eventDate >= today : eventDate < today;
  });

  return (
    <main className={`min-h-screen bg-[#F8FAFC] ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>
      <Navbar />
      
      <section className="relative pt-32 pb-24 bg-primary overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-1/2" />
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              {language === 'bn' ? 'ইভেন্ট এবং প্রোগ্রাম' : 'Events & Programs'}
            </h1>
            <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              {language === 'bn' 
                ? 'আসন্ন সকল ওয়ার্কশপ, সামিট, প্রতিযোগিতা এবং নেটওয়ার্কিং সেশনগুলো সম্পর্কে জানুন এবং রেজিস্ট্রেশন করুন।' 
                : 'Discover and register for upcoming workshops, summits, competitions, and networking sessions.'}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="py-20 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
            <button onClick={() => setActiveTab('upcoming')} className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'upcoming' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
              {language === 'bn' ? 'আসন্ন ইভেন্ট' : 'Upcoming'}
            </button>
            <button onClick={() => setActiveTab('past')} className={`px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'past' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
              {language === 'bn' ? 'অতীতের ইভেন্ট' : 'Past Events'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-secondary" />
              <span className="text-gray-400 font-bold">Fetching events...</span>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {currentEvents.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-400 font-bold italic">
                  {language === 'bn' ? 'কোনো ইভেন্ট পাওয়া যায়নি।' : 'No events found.'}
                </div>
              ) : currentEvents.map((event, index) => (
                <motion.div key={event._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group ${!event.isOpen && 'grayscale-[0.5]'}`}>
                  <Link href={`/events/${event._id}`} className="relative h-60 block overflow-hidden">
                    <img src={event.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest text-primary shadow-sm uppercase">{event.category}</span>
                    </div>
                  </Link>
                  <div className="p-8">
                    <Link href={`/events/${event._id}`}><h3 className="text-2xl font-bold text-primary mb-5 group-hover:text-secondary transition-colors">{event.title}</h3></Link>
                    <div className="space-y-3.5 mb-8">
                      <div className="flex items-center gap-3 text-gray-500"><Calendar className="w-4.5 h-4.5 text-secondary" /><span className="text-sm font-semibold">{event.date}</span></div>
                      <div className="flex items-center gap-3 text-gray-500"><MapPin className="w-4.5 h-4.5 text-secondary" /><span className="text-sm font-semibold">{event.location}</span></div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      {event.isOpen ? (
                        <Link href={`/events/${event._id}`} className="text-primary font-bold text-sm flex items-center gap-1 hover:text-secondary transition-colors">{language === 'bn' ? 'রেজিস্ট্রেশন করুন' : 'Register Now'}<ChevronRight className="w-4 h-4" /></Link>
                      ) : (
                        <div className="text-gray-400 font-bold text-sm flex items-center gap-1 cursor-not-allowed"><Lock className="w-4 h-4" />{language === 'bn' ? 'রেজিস্ট্রেশন বন্ধ' : 'Registration Closed'}</div>
                      )}
                      <ArrowRight className={`w-5 h-5 transition-all ${event.isOpen ? 'text-gray-300 group-hover:text-secondary group-hover:translate-x-1' : 'text-gray-200'}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </main>
  );
};

export default EventsPage;
