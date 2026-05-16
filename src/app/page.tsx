'use client';

import { useLanguage } from "@/components/providers/LanguageProvider";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import Countdown from "@/components/ui/Countdown";
import { ArrowRight, Sparkles, Calendar, MapPin, Award } from "lucide-react";
import Gallery from "@/components/sections/Gallery";
import FeaturedEvent from "@/components/sections/FeaturedEvent";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getPublicStats } from "@/actions/stats";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { t, language } = useLanguage();
  const [memberCount, setMemberCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getPublicStats();
      setMemberCount(data.registeredMembers);
    };
    fetchStats();
  }, []);

  return (
    <main className={`min-h-screen ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 pb-16 md:pb-28 flex items-center overflow-hidden bg-white">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[10%] left-[5%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[120px] opacity-70" />
          <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px] opacity-70" />
        </div>

        {/* Architectural Sketch Background Overlay */}
        <div className="absolute bottom-[40px] md:bottom-[90px] left-[-5%] md:left-[2%] w-[65%] md:w-[38%] max-w-[600px] aspect-square -z-10 opacity-[0.13] pointer-events-none mix-blend-multiply">
          <img
            src="/sketch_building.png"
            alt="Historical academic gate sketch background pattern"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-white font-bold text-[10px] mb-4 shadow-lg shadow-secondary/20">
                <Sparkles className="w-3 h-3 text-white/80" />
                <span>{language === 'bn' ? 'রিইউনিয়ন 2.0 (2026)' : 'Reunion 2.0 (2026)'}</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-primary leading-[1.2] mb-6">
                {t.hero.title}
              </h1>
              
              <div className="relative p-5 md:p-6 bg-gradient-to-br from-primary/5 via-white/50 to-secondary/5 rounded-[1.5rem] border border-primary/10 shadow-lg shadow-primary/5 mb-6 backdrop-blur-sm group hover:border-primary/20 hover:shadow-xl transition-all">
                {/* Decorative Quotes */}
                <div className="absolute -top-2 -left-1 text-5xl md:text-6xl text-primary/20 font-serif leading-none group-hover:scale-110 transition-transform group-hover:text-primary/30">"</div>
                <div className="absolute -bottom-6 -right-1 text-5xl md:text-6xl text-secondary/20 font-serif leading-none rotate-180 group-hover:scale-110 transition-transform group-hover:text-secondary/30">"</div>
                
                <div className="text-lg md:text-xl lg:text-[1.4rem] font-bold tracking-wide text-gray-800 leading-[1.6] whitespace-pre-line relative z-10">
                  {t.hero.subtitle}
                </div>
              </div>

              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 max-w-xl font-medium">
                {language === 'bn'
                  ? 'হারিয়ে যাওয়া দিনগুলোর স্মৃতি রোমন্থন করতে এবং পুরোনো বন্ধুদের সাথে আবার মিলিত হতে আজই আপনার নাম নথিভুক্ত করুন।'
                  : 'Register today to reminisce about the lost days and reconnect with old friends once again.'}
              </p>


              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <Link href="/register" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-4 bg-secondary text-white rounded-2xl font-bold text-lg shadow-xl shadow-secondary/20 hover:bg-opacity-90 transition-all flex items-center justify-center gap-3 w-full"
                  >
                    <span>{t.hero.cta}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>

                <Link href="/sponsor" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-opacity-95 transition-all flex items-center justify-center gap-3 w-full"
                  >
                    <Award className="w-5 h-5 text-secondary animate-pulse" />
                    <span>{t.hero.sponsorCta}</span>
                  </motion.button>
                </Link>

                <Link href="/events" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-primary border-2 border-primary/10 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-sm w-full"
                  >
                    {t.nav.events}
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Right Content - Countdown & Decoration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative lg:ml-auto w-full max-w-[500px]"
            >
              {/* Decorative Circle */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-[30px] border-primary/5 rounded-full animate-spin-slow" />

              <div className="relative bg-white/30 backdrop-blur-md p-8 md:p-10 rounded-[3.5rem] border border-white/40 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-all" />

                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {language === 'bn' ? 'রিইউনিয়ন শুরু হতে বাকি' : 'Countdown to Reunion'}
                  </h3>
                  <div className="w-12 h-1 bg-secondary mx-auto rounded-full" />
                </div>

                <Countdown />

                <div className="mt-10 p-5 bg-gradient-to-br from-primary to-blue-900 rounded-[2rem] text-white text-center shadow-xl">
                  <p className="text-xs font-medium opacity-80 uppercase tracking-widest mb-1">
                    {language === 'bn' ? 'অংশগ্রহণকারী সংখ্যা' : 'Registered Members'}
                  </p>
                  <p className="text-3xl font-black flex justify-center items-center h-9">
                    {memberCount === null ? (
                      <Loader2 className="w-6 h-6 animate-spin text-white/80" />
                    ) : (
                      `${30 + (memberCount || 0)}+`
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <FeaturedEvent />

      <Gallery />

      {/* Registration / Events sections would follow... */}
    </main>
  );
}
