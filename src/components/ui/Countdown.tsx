'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../providers/LanguageProvider';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown = () => {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetDate, setTargetDate] = useState<string>('2026-12-31T23:59:59');

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const res = await fetch('/api/admin/content');
        const data = await res.json();
        const dateSetting = data.find((c: any) => c.key === 'reunion_date');
        if (dateSetting) {
          setTargetDate(dateSetting.value);
        }
      } catch (error) {
        console.error('Failed to fetch reunion date', error);
      }
    };
    fetchDate();
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: language === 'bn' ? 'DAYS' : 'DAYS', value: timeLeft.days },
    { label: language === 'bn' ? 'HOURS' : 'HOURS', value: timeLeft.hours },
    { label: language === 'bn' ? 'MINS' : 'MINS', value: timeLeft.minutes },
    { label: language === 'bn' ? 'SECS' : 'SECS', value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
      {timeUnits.map((unit, index) => (
        <div key={index} className="flex flex-col items-center gap-4">
          {/* Flip Card Container */}
          <div className="relative group">
            {/* The Main Card */}
            <motion.div
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="w-20 h-28 sm:w-28 sm:h-36 bg-gradient-to-b from-secondary to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden border-b-4 border-orange-800"
            >
              {/* Horizontal Line In Middle */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-[2px] bg-black/10 z-10" />
              </div>

              {/* Little Pin Holes on Sides */}
              <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-black/20 rounded-full" />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-black/20 rounded-full" />

              {/* Number */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={unit.value}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="text-3xl sm:text-5xl font-black text-primary tabular-nums z-20"
                >
                  {String(unit.value).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            </motion.div>

            {/* Bottom Label Badge */}
            <div className="mt-4 flex justify-center">
              <div className="px-4 py-1.5 bg-white rounded-full shadow-lg border border-gray-100">
                <span className="text-[10px] font-black text-primary tracking-widest uppercase">
                  {unit.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
