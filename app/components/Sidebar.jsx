"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  // Links no array
  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'Upload Resume', href: '/upload', icon: '📤' },
    { name: 'Interview Prep', href: '/interview', icon: '🎤' },
    { name: 'Cover Letter', href: '/cover-letter', icon: '📝' },
    { name: 'Reports', href: '/reports', icon: '📑' },
    { name: 'Find Jobs', href: '/jobs', icon: '💼' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col 
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0 top-16' : '-translate-x-full top-16 md:top-0'}
      `}>
        <div className="p-4 space-y-2 overflow-y-auto flex-1 pb-20 md:pb-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen && setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
