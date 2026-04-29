'use client';

import { useLanguage } from "@/components/providers/LanguageProvider";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import Countdown from "@/components/ui/Countdown";
import { ArrowRight, Sparkles, Calendar, MapPin } from "lucide-react";
import Gallery from "@/components/sections/Gallery";
import Link from "next/link";

export default function Home() {
  const { t, language } = useLanguage();

  return (
    <main className={`min-h-screen ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 flex items-center overflow-hidden bg-white">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[10%] left-[5%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[120px] opacity-70" />
          <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px] opacity-70" />
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
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-primary leading-[1.2] mb-5">
                {t.hero.title}
                <span className="block mt-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {t.hero.subtitle}
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 max-w-lg font-medium">
                {language === 'bn' 
                  ? 'হারিয়ে যাওয়া দিনগুলোর স্মৃতি রোমন্থন করতে এবং পুরোনো বন্ধুদের সাথে আবার মিলিত হতে আজই আপনার নাম নথিভুক্ত করুন।' 
                  : 'Register today to reminisce about the lost days and reconnect with old friends once again.'}
              </p>


              <div className="flex flex-col sm:flex-row gap-4">
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
                  <p className="text-3xl font-black">1,240+</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Gallery />

      {/* Registration / Events sections would follow... */}
    </main>
  );
}
