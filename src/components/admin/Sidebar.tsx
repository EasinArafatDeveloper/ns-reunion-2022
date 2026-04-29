'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Bell, 
  Image as ImageIcon, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '/admin' },
    { name: 'Registrations', icon: Users, href: '/admin/registrations' },
    { name: 'Events', icon: Calendar, href: '/admin/events' },
    { name: 'Notices', icon: Bell, href: '/admin/notices' },
    { name: 'Gallery', icon: ImageIcon, href: '/admin/gallery' },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col p-8">
      {/* Admin Branding */}
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/20 text-primary font-black text-2xl">
          A
        </div>
        <div>
          <h1 className="font-black text-xl tracking-tight text-white">ADMIN PANEL</h1>
          <p className="text-[10px] text-white/50 font-bold tracking-[0.2em] uppercase">Reunion 2022</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                isActive ? 'bg-secondary text-primary' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-white/60 group-hover:text-white'}`} />
                <span className="font-bold">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pt-8 border-t border-white/10">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-4 p-4 w-full text-white/60 hover:text-red-400 transition-colors font-bold"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-6 right-6 z-[60]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 h-screen bg-primary fixed left-0 top-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-primary z-[55] shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
