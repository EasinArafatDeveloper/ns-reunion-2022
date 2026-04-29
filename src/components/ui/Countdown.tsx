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
  ];

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex gap-6 md:gap-10">
        {items.map((item, index) => (
          <div key={item.label} className="flex flex-col items-center gap-5 group">
            {/* Flip Card Container */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative w-28 h-40 md:w-32 md:h-44 bg-secondary rounded-[2rem] shadow-[0_20px_50px_rgba(255,140,0,0.3)] flex flex-col overflow-hidden border-2 border-white/20"
            >
              {/* Upper Half */}
              <div className="h-1/2 w-full bg-gradient-to-b from-secondary to-orange-500 border-b border-black/10 flex items-end justify-center overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={item.value}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    className="text-6xl md:text-7xl font-black text-primary leading-none translate-y-1/2 tracking-tighter"
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
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    className="text-6xl md:text-7xl font-black text-primary leading-none -translate-y-1/2 tracking-tighter"
                  >
                    {item.value.toString().padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              
              {/* Center Line Shadow */}
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black/10 z-10" />
              
              {/* Side Pin Effects */}
              <div className="absolute top-1/2 left-1 w-2 h-4 bg-primary/20 -translate-y-1/2 rounded-full blur-[1px]" />
              <div className="absolute top-1/2 right-1 w-2 h-4 bg-primary/20 -translate-y-1/2 rounded-full blur-[1px]" />
            </motion.div>
            
            {/* Label Badge */}
            <div className="px-5 py-2 bg-white rounded-2xl shadow-xl shadow-primary/5 border border-gray-100 transform -rotate-1 group-hover:rotate-0 transition-transform">
              <span className="text-xs font-black text-primary tracking-[0.2em] uppercase">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Target Date Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="relative group cursor-default"
      >
        <div className="absolute inset-0 bg-secondary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="relative px-12 py-5 bg-primary text-white rounded-[2rem] shadow-2xl border-2 border-white/10 flex items-center gap-4 overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
          <span className="text-xl md:text-2xl font-black tracking-wider uppercase">
            31st December, 2026
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Countdown;
