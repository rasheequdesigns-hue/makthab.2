import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Command, ArrowRight, Shield, Book, 
  Users, BarChart3, QrCode, LogOut, ChevronRight
} from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { books, isAdminAuthenticated, logout } = useLibraryStore();

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const filteredItems = query === '' ? [] : [
    ...books.filter(b => b.title.toLowerCase().includes(query.toLowerCase())).map(b => ({
      id: b.id,
      title: b.title,
      type: 'Asset',
      icon: <Book size={16} />,
      perform: () => { navigate('/'); setIsOpen(false); }
    })),
    {
      id: 'nav-home',
      title: 'Navigate: Repository Home',
      type: 'Protocol',
      icon: <Shield size={16} />,
      perform: () => { navigate('/'); setIsOpen(false); }
    },
    ...(isAdminAuthenticated ? [
      {
        id: 'nav-admin',
        title: 'Navigate: Control Console',
        type: 'Protocol',
        icon: <BarChart3 size={16} />,
        perform: () => { navigate('/admin'); setIsOpen(false); }
      },
      {
        id: 'action-logout',
        title: 'Execute: System Termination',
        type: 'Security',
        icon: <LogOut size={16} />,
        perform: () => { logout(); navigate('/login'); setIsOpen(false); }
      }
    ] : [
      {
        id: 'nav-login',
        title: 'Navigate: Authorization Node',
        type: 'Security',
        icon: <Shield size={16} />,
        perform: () => { navigate('/login'); setIsOpen(false); }
      }
    ])
  ].slice(0, 8);

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed top-8 right-32 z-[100] px-6 py-3 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-black/5 dark:border-white/10 shadow-2xl flex items-center gap-4 group hover:scale-105 transition-all text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
    >
      <Command size={16} />
      <span className="text-[10px] font-semibold">Protocol Search</span>
      <span className="bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded text-[8px] font-semibold">⌘K</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-6">
      <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setIsOpen(false)} />
      
      <div className="w-full max-w-2xl bg-white dark:bg-[#1c1c1e] rounded-[3.5rem] border border-black/5 dark:border-white/10 shadow-[0_80px_160px_rgba(0,0,0,0.4)] relative flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-top-10 duration-500">
        <div className="p-10 flex items-center gap-6 border-b border-black/5 dark:border-white/10">
          <Search className="text-black/20 dark:text-white/20" size={28} />
          <input 
            autoFocus
            type="text" 
            placeholder="Execute protocol search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-2xl font-semibold text-black dark:text-white placeholder:text-black/10 dark:placeholder:text-white/10"
          />
          <button onClick={() => setIsOpen(false)} className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-all"><X size={20} /></button>
        </div>

        <div className="flex-1 max-h-[60vh] overflow-y-auto scrollbar-hide p-4">
          {filteredItems.length > 0 ? (
            <div className="flex flex-col gap-2">
              {filteredItems.map(item => (
                <button 
                  key={item.id}
                  onClick={item.perform}
                  className="w-full p-6 rounded-[2rem] flex items-center justify-between group hover:bg-black dark:hover:bg-white transition-all text-left"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/30 dark:text-white/30 group-hover:bg-white/10 dark:group-hover:bg-black/10 group-hover:text-white dark:group-hover:text-black transition-all">
                      {item.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-black/30 dark:text-white/30 group-hover:text-white/40 dark:group-hover:text-black/40">{item.type}</span>
                      <span className="text-lg font-semibold tracking-tight font-semibold text-black dark:text-white group-hover:text-white dark:group-hover:text-black">{item.title}</span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-black/10 dark:text-white/10 group-hover:text-white dark:group-hover:text-black group-hover:translate-x-2 transition-all" />
                </button>
              ))}
            </div>
          ) : query !== '' ? (
            <div className="py-20 flex flex-col items-center justify-center opacity-20">
              <span className="text-6xl font-semibold mb-4">Null Hash</span>
              <span className="text-[10px] font-semibold">No matching registry vectors found.</span>
            </div>
          ) : (
            <div className="p-6">
               <span className="text-[10px] font-semibold text-black/20 dark:text-white/20 mb-6 block px-6">System Entry Segments</span>
               <div className="grid grid-cols-2 gap-4">
                  <QuickLink onClick={() => { navigate('/'); setIsOpen(false); }} icon={<Book size={18} />} label="Archive" />
                  <QuickLink onClick={() => { navigate('/admin'); setIsOpen(false); }} icon={<Shield size={18} />} label="Console" />
               </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/10 flex justify-between items-center opacity-40">
           <div className="flex gap-6">
              <div className="flex items-center gap-2"><span className="text-[9px] font-semibold text-black dark:text-white">↑↓: Navigate</span></div>
              <div className="flex items-center gap-2"><span className="text-[9px] font-semibold text-black dark:text-white">↵: Execute</span></div>
           </div>
           <span className="text-[8px] font-semibold text-black dark:text-white">Institutional Logic Engine v1.0.0</span>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="p-10 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10 hover:shadow-xl transition-all flex flex-col items-center gap-4 group">
       <div className="text-black/30 dark:text-white/30 group-hover:scale-125 transition-transform">{icon}</div>
       <span className="text-[10px] font-semibold text-black/40 dark:text-white/40">{label}</span>
    </button>
  );
}

function X({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}
