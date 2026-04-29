'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-12-31T23:59:59').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const items = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINS', value: timeLeft.minutes },
    { label: 'SECS', value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
        {items.map((item, index) => (
          <div key={item.label} className="flex flex-col items-center gap-3 group">
            {/* Flip Card Container - Reduced Size */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative w-20 h-28 md:w-24 md:h-32 bg-secondary rounded-2xl shadow-[0_15px_35px_rgba(255,140,0,0.2)] flex flex-col overflow-hidden border-2 border-white/20"
            >
              {/* Upper Half */}
              <div className="h-1/2 w-full bg-gradient-to-b from-secondary to-orange-500 border-b border-black/10 flex items-end justify-center overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={item.value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-4xl md:text-5xl font-black text-primary leading-none translate-y-1/2 tracking-tighter"
                  >
                    {item.value.toString().padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              
              {/* Lower Half */}
              <div className="h-1/2 w-full bg-gradient-to-t from-secondary to-orange-400 flex items-start justify-center overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={item.value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-4xl md:text-5xl font-black text-primary leading-none -translate-y-1/2 tracking-tighter"
                  >
                    {item.value.toString().padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              
              {/* Center Line Shadow */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/10 z-10" />
              
              {/* Side Pin Effects */}
              <div className="absolute top-1/2 left-0.5 w-1.5 h-3 bg-primary/20 -translate-y-1/2 rounded-full blur-[0.5px]" />
              <div className="absolute top-1/2 right-0.5 w-1.5 h-3 bg-primary/20 -translate-y-1/2 rounded-full blur-[0.5px]" />
            </motion.div>
            
            {/* Label Badge - Smaller */}
            <div className="px-3 py-1 bg-white rounded-xl shadow-lg shadow-primary/5 border border-gray-50 transform -rotate-1 group-hover:rotate-0 transition-transform">
              <span className="text-[10px] font-black text-primary tracking-widest uppercase">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Target Date Banner - Smaller */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="relative group cursor-default"
      >
        <div className="absolute inset-0 bg-secondary blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="relative px-8 py-3.5 bg-primary text-white rounded-2xl shadow-xl border border-white/5 flex items-center gap-3 overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
          <span className="text-sm md:text-base font-black tracking-widest uppercase">
            31st December, 2026
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Countdown;
