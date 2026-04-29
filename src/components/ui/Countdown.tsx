'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    // Fetch the dynamic date from database
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
    { label: language === 'bn' ? 'দিন' : 'Days', value: timeLeft.days },
    { label: language === 'bn' ? 'ঘণ্টা' : 'Hours', value: timeLeft.hours },
    { label: language === 'bn' ? 'মিনিট' : 'Mins', value: timeLeft.minutes },
    { label: language === 'bn' ? 'সেকেন্ড' : 'Secs', value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-4 min-w-[60px] sm:min-w-[80px] shadow-xl">
            <span className="text-2xl sm:text-4xl font-black text-secondary tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-white/60 uppercase tracking-widest mt-2">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default Countdown;
