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
    <div className="flex flex-row items-center justify-center gap-1.5 sm:gap-4 flex-nowrap">
      {timeUnits.map((unit, index) => (
        <div key={index} className="flex flex-col items-center gap-2 sm:gap-3">
          {/* Smaller Flip Card Container */}
          <div className="relative group">
            {/* The Main Card (Smaller Size) */}
            <motion.div
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="w-14 h-20 sm:w-20 sm:h-28 bg-gradient-to-b from-secondary to-orange-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden border-b-2 sm:border-b-4 border-orange-800"
            >
              {/* Horizontal Line In Middle */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-[1px] sm:h-[2px] bg-black/10 z-10" />
              </div>

              {/* Number (Smaller font) */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={unit.value}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -5, opacity: 0 }}
                  className="text-xl sm:text-3xl font-black text-primary tabular-nums z-20"
                >
                  {String(unit.value).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            </motion.div>

            {/* Bottom Label Badge (Smaller) */}
            <div className="mt-2 flex justify-center">
              <div className="px-2 py-0.5 sm:px-4 sm:py-1.5 bg-white rounded-full shadow-md border border-gray-50">
                <span className="text-[7px] sm:text-[9px] font-black text-primary tracking-widest uppercase">
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
