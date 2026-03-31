import React, { useState } from 'react';
import { useLibraryStore } from '../store/useLibraryStore';
import { 
  User, BookOpen, Clock, Heart, Award, ArrowUpRight, 
  Settings, LogOut, ChevronRight, Zap, ShieldCheck, Database,
  TrendingUp, BarChart3, Activity, X, LayoutGrid, List,
  BookMarked, Hash
} from 'lucide-react';
import BookCard from '../components/BookCard';

export default function StudentProfile() {
  const { currentUser, books, favorites, readingGoals, reservationRequests = [] } = useLibraryStore();
  
  const [activeTab, setActiveTab] = useState('favorites');

  if (!currentUser) return null;

  const userReservations = reservationRequests.filter(r => r.studentId === currentUser.id);
  const goal = readingGoals?.[currentUser.id] || { completed: 0, target: 10 };
  const favoriteBooks = books.filter(b => favorites.includes(b.id));
  const loanHistory = books.filter(b => b.borrowerName === currentUser.name);

  const completedCount = goal.completed || 0;
  const goalProgress = Math.min(100, Math.round((completedCount / (goal.target || 10)) * 100));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-8 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 mt-4 sm:mt-10">
        
        {/* Profile Header - Mobile Optimized Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
           <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 sm:gap-6">
              <div className="w-20 h-20 sm:w-32 sm:h-32 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-3xl sm:text-5xl shadow-sm border-4 border-white dark:border-gray-800 relative shrink-0">
                 {currentUser.name[0]}
                 <div className="absolute bottom-0.5 right-0.5 sm:bottom-2 sm:right-2 w-3.5 h-3.5 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0">
                 <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">
                    <Hash size={14} className="shrink-0" />
                    <span className="truncate">Student ID: {currentUser.admissionNumber || 'UNSET'}</span>
                 </div>
                 <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight truncate w-full max-w-xs sm:max-w-none">
                   {currentUser.name}
                 </h1>
              </div>
           </div>

           <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg w-full md:w-auto overflow-x-auto no-scrollbar touch-pan-x shadow-inner">
              <div className="flex min-w-max w-full">
                <ProfileTab active={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} icon={<Heart size={14} />} label="Saved" />
                <ProfileTab active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<BookMarked size={14} />} label="History" />
                <ProfileTab active={activeTab === 'reservations'} onClick={() => setActiveTab('reservations')} icon={<Clock size={14} />} label="Pending" />
                <ProfileTab active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} icon={<Award size={14} />} label="Goals" />
              </div>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
           
           {/* Sidebar: Stats & Goals - Mobile Grid */}
           <aside className="w-full lg:w-80 flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                 <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Award size={14} className="text-blue-500" /> Reading Goal
                 </h3>
                 
                 <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6">
                    <svg className="w-full h-full -rotate-90">
                       <circle cx="50%" cy="50%" r="42%" fill="transparent" stroke="currentColor" strokeWidth="8%" className="text-gray-100 dark:text-gray-700" />
                       <circle cx="50%" cy="50%" r="42%" fill="transparent" stroke="currentColor" strokeWidth="8%" 
                         className="text-blue-500 transition-all duration-1000 ease-out" 
                         strokeDasharray="264%" 
                         strokeDashoffset={`${264 * (1 - goalProgress / 100)}%`} 
                         strokeLinecap="round"
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">{goalProgress}%</span>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase border-t border-gray-50 dark:border-gray-700/50 pt-4">
                    <span>Registry</span>
                    <span className="text-gray-900 dark:text-white">{completedCount} / {goal.target || 10}</span>
                 </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                 <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BarChart3 size={14} className="text-purple-500" /> Academic Stats
                 </h3>
                 <div className="space-y-3">
                    <StatLine label="Total Records" value={loanHistory.length} />
                    <StatLine label="Saved Assets" value={favorites.length} />
                    <StatLine label="Ranking" value="Master" />
                 </div>
              </div>
           </aside>

           {/* Main Content Area - Fully Adaptive */}
           <main className="flex-1 w-full bg-white dark:bg-gray-800 p-5 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[400px] sm:min-h-[500px]">
              <div className="flex items-center justify-between mb-8 border-b border-gray-50 dark:border-gray-700/50 pb-4">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  {activeTab === 'favorites' ? 'Saved Collections' : activeTab === 'history' ? 'Borrowing History' : activeTab === 'reservations' ? 'Pending Requests' : 'Achievement Center'}
                </h2>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                   {activeTab === 'favorites' ? <Heart size={18}/> : activeTab === 'history' ? <Database size={18}/> : activeTab === 'reservations' ? <Clock size={18}/> : <Award size={18}/>}
                </div>
              </div>
              
              {activeTab === 'favorites' && (
                <div className="animate-in fade-in duration-500">
                   {favoriteBooks.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                       {favoriteBooks.map((book) => (
                         <div key={book.id}>
                           <BookCard book={book} />
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/10">
                        <Heart className="w-12 h-12 text-gray-200 dark:text-gray-700 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Vault is empty</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm px-4">Start your journey by adding books from the catalog to your personal repository.</p>
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'history' && (
                 <div className="space-y-4 animate-in fade-in duration-500">
                    {loanHistory.length > 0 ? (
                      loanHistory.map((book, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/20 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                           <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto mb-4 sm:mb-0 min-w-0">
                              {book.coverUrl ? (
                                <img src={book.coverUrl} className="w-14 sm:w-16 h-20 sm:h-24 object-cover rounded-lg shadow-sm border border-white dark:border-gray-800 shrink-0" alt="cover" />
                              ) : (
                                <div className="w-14 sm:w-16 h-20 sm:h-24 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm shrink-0 border border-gray-100 dark:border-gray-600">
                                   <BookOpen className="text-gray-300" size={24} />
                                </div>
                              )}
                              <div className="min-w-0">
                                 <h4 className="text-base sm:text-lg font-black text-gray-900 dark:text-white truncate">{book.title}</h4>
                                 <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-medium truncate mb-2">{book.author}</p>
                                 <div className="flex items-center gap-2">
                                    <span className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded uppercase tracking-tighter">
                                      Due: {book.lendEndDate || 'TBD'}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <button className="w-full sm:w-auto p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-all flex justify-center items-center gap-2 shadow-sm">
                             Record Detail <ArrowUpRight size={14}/>
                           </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/10">
                         <Database className="w-12 h-12 text-gray-200 dark:text-gray-700 mb-4" />
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No activity log</h3>
                         <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm px-4">Your borrowing history will appear here once you process your first loan.</p>
                      </div>
                    )}
                 </div>
              )}

              {activeTab === 'reservations' && (
                 <div className="space-y-4 animate-in fade-in duration-500">
                    {userReservations.length > 0 ? (
                      [...userReservations].reverse().map((req, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
                           <div className="flex items-center gap-4 w-full sm:w-auto mb-3 sm:mb-0">
                              <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-100 dark:border-gray-700 shrink-0">
                                 <BookOpen size={18} className="text-blue-500" />
                              </div>
                              <div className="min-w-0">
                                 <h4 className="font-bold text-gray-900 dark:text-white truncate">{req.bookTitle}</h4>
                                 <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded
                                      ${req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                                        req.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                        'bg-red-100 text-red-700'}`}>
                                      {req.status}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium">Ref: {req.id.slice(0, 6)}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest w-full sm:w-auto">
                              {new Date(req.timestamp).toLocaleDateString()}
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/10">
                         <Clock className="w-12 h-12 text-gray-200 dark:text-gray-700 mb-4" />
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Queue is clear</h3>
                         <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm px-4">There are no pending book requests in your queue at this moment.</p>
                      </div>
                    )}
                 </div>
              )}

              {activeTab === 'achievements' && (
                <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/10 animate-in fade-in duration-500">
                   <Award className="w-12 h-12 text-gray-200 dark:text-gray-700 mb-4" />
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Archive Locked</h3>
                   <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm px-4">Achievement protocols and reading leaderboards will be initialized in the next system cycle.</p>
                </div>
              )}
           </main>
        </div>
      </div>
    </div>
  );
}

function StatLine({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-50 dark:border-gray-700/30 last:border-0">
       <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">{label}</span>
       <span className="text-sm font-black text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

function ProfileTab({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-wide rounded-md transition-all whitespace-nowrap outline-none flex-1
        ${active 
          ? 'bg-white text-blue-600 shadow-md ring-1 ring-gray-100 dark:bg-gray-700 dark:text-blue-400 dark:ring-gray-600' 
          : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
