'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowLeft, Share2, Users, CheckCircle2, Ticket } from 'lucide-react';

const EventDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { language } = useLanguage();

  // In a real app, you would fetch this from an API/Database
  const eventData: any = {
    'main-reunion-2026': {
      title: language === 'bn' ? 'মেইন রিইউনিয়ন ২০২২' : 'Main Reunion 2022',
      date: 'Dec 31, 2026',
      time: '06:00 PM - 10:00 PM',
      location: 'Grand Ballroom, City Center',
      category: 'REUNION',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
      description: language === 'bn' 
        ? 'এনএস ইউনিটি ফোরামের সবচেয়ে বড় আয়োজন! এই ইভেন্টে আমরা আমাদের হারিয়ে যাওয়া দিনগুলোর স্মৃতি রোমন্থন করবো এবং পুরোনো বন্ধুদের সাথে নতুন করে সখ্যতা গড়ে তুলবো। সাংস্কৃতিক সন্ধ্যা, ডিনার এবং বিশেষ সম্মাননা প্রদান অনুষ্ঠানের মাধ্যমে এই রাতটিকে স্মরণীয় করে রাখা হবে।'
        : 'The biggest event of NS Unity Forum! In this event, we will reminisce about our lost days and build new friendships with old friends. The night will be made memorable through a cultural evening, dinner, and a special awards ceremony.',
      isOpen: true,
      perks: language === 'bn' ? ['গ্র্যান্ড ডিনার', 'সাংস্কৃতিক সন্ধ্যা', 'টি-শার্ট ও গিফট', 'ফটো সেশন'] : ['Grand Dinner', 'Cultural Night', 'T-shirt & Gifts', 'Photo Session']
    },
    'pre-reunion-2025': {
      title: language === 'bn' ? 'প্রি-রিইউনিয়ন মিটআপ' : 'Pre-Reunion Meetup',
      date: 'June 09, 2025',
      time: '04:00 PM - 07:00 PM',
      location: 'University Cafe',
      category: 'MEETUP',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop',
      description: language === 'bn' 
        ? 'মূল ইভেন্টের আগে আমাদের ছোট একটি গেট-টুগেদার। এখানে আমরা ভবিষ্যতের বড় আয়োজনের রূপরেখা নিয়ে আলোচনা করেছি এবং দীর্ঘ বিরতির পর একে অপরের সাথে দেখা করেছি।'
        : 'A small get-together before the main event. Here we discussed the outline of the future mega event and met each other after a long break.',
      isOpen: false,
      perks: language === 'bn' ? ['স্ন্যাকস ও কফি', 'নেটওয়ার্কিং', 'গ্রুপ ফটো'] : ['Snacks & Coffee', 'Networking', 'Group Photo']
    }
  };

  const event = eventData[id as string] || eventData['main-reunion-2026'];

  return (
    <main className={`min-h-screen bg-white ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>
      <Navbar />

      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img 
          src={event.image} 
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
                {event.category}
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
            <p className="text-gray-600 text-lg leading-relaxed mb-10 whitespace-pre-line">
              {event.description}
            </p>

            <h3 className="text-2xl font-bold text-primary mb-6">
              {language === 'bn' ? 'আপনি যা যা পাবেন' : 'What is included'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {event.perks.map((perk: string, index: number) => (
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
                  <button className="w-full py-5 bg-secondary text-white rounded-[1.5rem] font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-secondary/20">
                    <Ticket className="w-5 h-5" />
                    <span>{language === 'bn' ? 'টিকিট কিনুন' : 'Book Your Spot'}</span>
                  </button>
                  <button className="w-full py-5 bg-white text-primary border-2 border-primary/10 rounded-[1.5rem] font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
                    <Share2 className="w-5 h-5" />
                    <span>{language === 'bn' ? 'শেয়ার করুন' : 'Share Event'}</span>
                  </button>
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
                  {language === 'bn' ? '১,২৪০+ জন অংশগ্রহণ করছেন' : '1,240+ People attending'}
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
