'use client';

import Sidebar from '@/components/admin/Sidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // If it's the login page, don't show the sidebar
  if (isLoginPage) {
    return <div className="min-h-screen bg-primary">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F0F4F8] relative">
      <Sidebar />
      <main className="flex-1 w-full lg:ml-80 p-6 md:p-10 min-h-screen">
        {children}
      </main>
    </div>
  );
}
