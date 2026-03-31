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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 mt-10">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
           <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-4xl sm:text-5xl shadow-sm border-4 border-white dark:border-gray-800 relative">
                 {currentUser.name[0]}
                 <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                 <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                    <Hash size={16} />
                    <span>Student ID: {currentUser.admissionNumber || 'UNSET'}</span>
                 </div>
                 <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                   {currentUser.name}
                 </h1>
              </div>
           </div>

           <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
              <ProfileTab active={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} icon={<Heart size={16} />} label="Saved Books" />
              <ProfileTab active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<BookMarked size={16} />} label="History" />
              <ProfileTab active={activeTab === 'reservations'} onClick={() => setActiveTab('reservations')} icon={<Clock size={16} />} label="Reservations" />
              <ProfileTab active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} icon={<Award size={16} />} label="Goals" />
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
           
           {/* Sidebar: Stats & Goals */}
           <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                 <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                    <Award size={16} className="text-blue-500" /> Reading Goal
                 </h3>
                 
                 <div className="relative w-40 h-40 mx-auto mb-6">
                    <svg className="w-full h-full -rotate-90">
                       <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-gray-100 dark:text-gray-700" />
                       <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" 
                         className="text-blue-500 transition-all duration-1000 ease-out" 
                         strokeDasharray={`${2 * Math.PI * 70}`} 
                         strokeDashoffset={`${2 * Math.PI * 70 * (1 - goalProgress / 100)}`} 
                         strokeLinecap="round"
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-3xl font-bold text-gray-900 dark:text-white">{goalProgress}%</span>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-center text-sm font-medium text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span>Progress</span>
                    <span className="text-gray-900 dark:text-white font-bold">{completedCount} / {goal.target || 10}</span>
                 </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                 <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 size={16} className="text-purple-500" /> Reading Stats
                 </h3>
                 <div className="space-y-4">
                    <StatLine label="Books Borrowed" value={loanHistory.length} />
                    <StatLine label="Saved Books" value={favorites.length} />
                    <StatLine label="Reader Level" value="Level 4" />
                 </div>
              </div>
           </aside>

           {/* Main Content Area */}
           <main className="flex-1 w-full bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[500px]">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
                {activeTab === 'favorites' ? 'Saved Collections' : activeTab === 'history' ? 'Borrowing History' : activeTab === 'reservations' ? 'My Reservations' : 'Reading Achievements'}
              </h2>
              
              {activeTab === 'favorites' && (
                <div>
                   {favoriteBooks.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                       {favoriteBooks.map((book) => (
                         <div key={book.id}>
                           <BookCard book={book} />
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No saved books</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm">You haven't added any books to your favorites yet. Browse the catalog to find your next great read.</p>
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'history' && (
                 <div className="space-y-4">
                    {loanHistory.length > 0 ? (
                      loanHistory.map((book, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                           <div className="flex items-center gap-6 w-full sm:w-auto mb-4 sm:mb-0">
                              {book.coverUrl ? (
                                <img src={book.coverUrl} className="w-16 h-24 object-cover rounded-md shadow-sm border border-gray-200 dark:border-gray-600" alt="cover" />
                              ) : (
                                <div className="w-16 h-24 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center shadow-sm">
                                   <BookOpen className="text-gray-400" />
                                </div>
                              )}
                              <div>
                                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{book.title}</h4>
                                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{book.author}</p>
                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                   Return Date: {book.lendEndDate || 'Not Set'}
                                 </span>
                              </div>
                           </div>
                           <button className="w-full sm:w-auto p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-colors flex justify-center items-center">
                             View Details
                           </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                         <Database className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No borrowing history</h3>
                         <p className="text-gray-500 dark:text-gray-400 max-w-sm">You haven't borrowed any books from the library yet.</p>
                      </div>
                    )}
                 </div>
              )}

              {activeTab === 'reservations' && (
                 <div className="space-y-4">
                    {userReservations.length > 0 ? (
                      [...userReservations].reverse().map((req, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                           <div className="flex items-center gap-6 w-full sm:w-auto">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                 <BookOpen size={18} className="text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                 <h4 className="font-bold text-gray-900 dark:text-white">{req.bookTitle}</h4>
                                 <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                                   ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                     req.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                     'bg-red-100 text-red-800'}`}>
                                   {req.status}
                                 </span>
                              </div>
                           </div>
                           <div className="text-right text-xs text-gray-500">
                              {new Date(req.timestamp).toLocaleDateString()}
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                         <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No reservations</h3>
                         <p className="text-gray-500 dark:text-gray-400 max-w-sm">Reserve a book from the catalog to see it here.</p>
                      </div>
                    )}
                 </div>
              )}

              {activeTab === 'achievements' && (
                <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                   <Award className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Coming Soon</h3>
                   <p className="text-gray-500 dark:text-gray-400 max-w-sm">Achievement badges and reading leaderboards will be available in the next update.</p>
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
    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
       <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
       <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

function ProfileTab({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap outline-none flex-1 md:flex-auto
        ${active 
          ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200 dark:bg-gray-600 dark:text-white dark:ring-gray-600' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700/50'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
