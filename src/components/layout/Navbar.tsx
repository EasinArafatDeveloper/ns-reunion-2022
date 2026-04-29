'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const navLinks = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.events, href: '/events' },
    { name: t.nav.gallery, href: '/#gallery' },
    { name: t.nav.notice, href: '/notices' },
    { name: t.nav.register, href: '/register' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.jpg" alt="NS Unity Forum" className="h-14 w-auto object-contain" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-bold transition-all ${
                  pathname === link.href 
                    ? ((pathname.startsWith('/events') || pathname.startsWith('/notices')) && !scrolled ? 'text-secondary' : 'text-primary')
                    : ((pathname.startsWith('/events') || pathname.startsWith('/notices')) && !scrolled ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-primary')
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all group font-semibold ${
                (pathname.startsWith('/events') || pathname.startsWith('/notices')) && !scrolled 
                  ? 'border-white/30 text-white hover:border-white hover:bg-white/10' 
                  : 'border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
              }`}
            >
              <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="text-sm">
                {language === 'bn' ? 'বাংলা | English' : 'English | বাংলা'}
              </span>
            </button>

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full border border-gray-200"
            >
              <span className="text-xs font-bold">{language === 'bn' ? 'EN' : 'BN'}</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
