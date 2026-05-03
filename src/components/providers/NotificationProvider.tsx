'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasUnread, setHasUnread] = useState(false);
  
  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const sendNotification = (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/logo.png' });
    }
    setHasUnread(true);
  };

  const markAsRead = () => {
    setHasUnread(false);
  };

  useEffect(() => {
    requestPermission();

    const checkNewNotices = async () => {
      try {
        const lastNoticeId = localStorage.getItem('last_notice_id');
        const res = await fetch('/api/admin/notices');
        const notices = await res.json();
        
        if (notices.length > 0) {
          const latestNotice = notices[0];
          if (lastNoticeId && lastNoticeId !== latestNotice._id) {
            sendNotification('নতুন নোটিশ!', latestNotice.title);
            setHasUnread(true);
          }
          localStorage.setItem('last_notice_id', latestNotice._id);
        }
      } catch (err) {
        console.error('Notice polling error:', err);
      }
    };

    checkNewNotices(); // Initial check
    const interval = setInterval(checkNewNotices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ sendNotification, hasUnread, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
