'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowLeft, Share2, Users, CheckCircle2, Ticket, Loader2 } from 'lucide-react';
import { getEventById } from '@/actions/events';
import { getPublicStats } from '@/actions/stats';

const EventDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { language } = useLanguage();

  const [event, setEvent] = useState<any>(null);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedEvent = await getEventById(id as string);
        setEvent(fetchedEvent);
        
        const stats = await getPublicStats();
        setMemberCount(stats.registeredMembers);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <main className={`min-h-screen bg-white ${language === 'bn' ? 'font-bengali' : 'font-sans'} flex items-center justify-center`}>
        <Navbar />
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-secondary animate-spin" />
          <p className="text-gray-500 font-bold">Loading event details...</p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className={`min-h-screen bg-white ${language === 'bn' ? 'font-bengali' : 'font-sans'} flex items-center justify-center`}>
        <Navbar />
        <div className="text-center">
          <h1 className="text-4xl font-black text-primary mb-4">Event Not Found</h1>
          <button onClick={() => router.push('/events')} className="px-6 py-3 bg-secondary text-white rounded-xl font-bold">Go Back</button>
        </div>
      </main>
    );
  }

  const perks = event.perks || (language === 'bn' ? ['গ্র্যান্ড ডিনার', 'সাংস্কৃতিক সন্ধ্যা', 'টি-শার্ট ও গিফট', 'ফটো সেশন'] : ['Grand Dinner', 'Cultural Night', 'T-shirt & Gifts', 'Photo Session']);

  return (
    <main className={`min-h-screen bg-white ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>
      <Navbar />

      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img 
          src={event.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop'} 
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="max-w-[1400px] mx-auto">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'bn' ? 'ফিরে যান' : 'Back to Events'}</span>
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="px-4 py-1.5 bg-secondary text-white rounded-full text-xs font-black tracking-widest uppercase mb-4 inline-block">
                {event.category || 'EVENT'}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight max-w-4xl">
                {event.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: Description and Details */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-primary mb-6">
              {language === 'bn' ? 'ইভেন্ট সম্পর্কে' : 'About this Event'}
            </h2>
            <div 
              className="text-gray-600 text-lg leading-relaxed mb-10 prose prose-primary max-w-none"
              dangerouslySetInnerHTML={{ __html: event.description || 'No description available for this event.' }}
            />

            <h3 className="text-2xl font-bold text-primary mb-6">
              {language === 'bn' ? 'আপনি যা যা পাবেন' : 'What is included'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {perks.map((perk: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-gray-700">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Sidebar Info & Action */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl shadow-primary/5 sticky top-32">
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/5 rounded-2xl">
                    <Calendar className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{language === 'bn' ? 'তারিখ' : 'Date'}</p>
                    <p className="text-lg font-bold text-primary">{event.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/5 rounded-2xl">
                    <Clock className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{language === 'bn' ? 'সময়' : 'Time'}</p>
                    <p className="text-lg font-bold text-primary">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/5 rounded-2xl">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{language === 'bn' ? 'স্থান' : 'Location'}</p>
                    <p className="text-lg font-bold text-primary">{event.location}</p>
                  </div>
                </div>
              </div>

              {event.isOpen ? (
                <div className="space-y-4">
                  <button 
                    onClick={() => router.push('/register')}
                    className="w-full py-5 bg-secondary text-white rounded-[1.5rem] font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-secondary/20"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{language === 'bn' ? 'রেজিস্ট্রেশন করুন' : 'Register Now'}</span>
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => {
                        const url = window.location.href;
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                      }}
                      className="py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10"
                    >
                      <span>Facebook</span>
                    </button>
                    <button 
                      onClick={() => {
                        const url = window.location.href;
                        window.open(`https://wa.me/?text=${encodeURIComponent('Join us at ' + event.title + ': ' + url)}`, '_blank');
                      }}
                      className="py-4 bg-green-500 text-white rounded-2xl font-bold text-sm hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/10"
                    >
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-red-50 rounded-[1.5rem] text-center">
                  <p className="text-red-600 font-bold">
                    {language === 'bn' ? 'দুঃখিত, রেজিস্ট্রেশন বন্ধ হয়ে গেছে' : 'Registration for this event is closed'}
                  </p>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-tighter">
                  {memberCount === null ? (
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  ) : (
                    language === 'bn' ? `${memberCount}+ জন অংশগ্রহণ করছেন` : `${memberCount}+ People attending`
                  )}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default EventDetailPage;
