import React, { useState } from 'react';
import { 
  Heart, BookOpen, Clock, ChevronRight, X, 
  Bookmark, Info, Share2, Download, Box, Hash, Database
} from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';

export default function BookCard({ book }) {
  const { toggleFavorite, favorites, requestReservation, reservationRequests = [], currentUser } = useLibraryStore();
  const [showModal, setShowModal] = useState(false);
  const [newQuote, setNewQuote] = useState('');
  
  const isFavorite = favorites.includes(book.id);

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex flex-col h-full"
      >
        {/* Cover Aspect Mapping */}
        <div className="relative aspect-[3/4] w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
           {book.coverUrl ? (
             <img 
               src={book.coverUrl} 
               alt={book.title}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
             />
           ) : (
             <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="text-gray-400 w-12 h-12" />
             </div>
           )}
           
           {/* Top Action Pulse */}
           <div className="absolute top-3 right-3">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite(book.id); }}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors border shadow-sm
                  ${isFavorite 
                    ? 'bg-red-50 dark:bg-red-900/30 text-red-500 border-red-200 dark:border-red-800' 
                    : 'bg-white/80 dark:bg-black/50 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-black/80'}`}
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
           </div>
           
           {/* Category Badge */}
           <div className="absolute top-3 left-3">
              <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded">
                {book.category}
              </span>
           </div>
        </div>

        {/* Technical Data Metadata */}
        <div className="p-4 flex flex-col flex-grow justify-between">
           <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {book.author}
              </p>
           </div>
           
           <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1.5">
                 <div className={`w-2 h-2 rounded-full ${book.status === 'Available' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                 <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{book.status}</span>
              </div>
              <span className="text-xs text-gray-400">
                 ID: #{book.id.slice(0, 4)}
              </span>
           </div>
        </div>
      </div>

      {/* Discovery Modal - Fully Responsive */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row relative max-h-[95vh] overflow-y-auto no-scrollbar lg:overflow-hidden translate-y-0 animate-in zoom-in-95 duration-300">
             <button 
               onClick={() => setShowModal(false)} 
               className="md:absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors m-4 md:m-0 self-end"
             >
               <X size={20} />
             </button>
             
             {/* Modal Left: Cover Image - Responsive Layout */}
             <div className="w-full md:w-5/12 bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6 sm:p-8 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none shrink-0">
                <div className="relative group/cover w-full max-w-[200px] sm:max-w-[240px]">
                   {book.coverUrl ? (
                     <img src={book.coverUrl} className="w-full shadow-2xl rounded-lg object-cover aspect-[3/4] border-4 border-white dark:border-gray-800" alt={`${book.title} cover`} />
                   ) : (
                     <div className="w-full aspect-[3/4] bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <BookOpen size={48} className="text-gray-300" />
                     </div>
                   )}
                   <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-2 rounded-lg shadow-lg">
                      <Database size={16} />
                   </div>
                </div>
             </div>

             {/* Modal Right: Details - Adaptive Padding */}
             <div className="w-full md:w-7/12 p-6 sm:p-8 md:p-10 flex flex-col min-h-0 overflow-y-auto">
                <div className="flex-grow">
                   <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-3 sm:mb-4 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                      <Hash size={14} />
                      <span>Archive ID: {book.id.slice(0, 8)}</span>
                   </div>
                   
                   <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight mb-2">
                     {book.title}
                   </h2>
                   <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-medium mb-6 sm:mb-8">
                     By <span className="text-blue-600 dark:text-blue-400">{book.author}</span>
                   </p>

                   <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                      <DetailField label="Current Status" value={
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight
                          ${book.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}
                        `}>
                          {book.status}
                        </span>
                      } />
                      <DetailField label="Category" value={book.category} />
                      <DetailField label="Total Pages" value={book.totalPages || '342'} />
                      <DetailField label="Borrower" value={book.borrowerName || 'None'} />
                   </div>
                </div>

                {/* Actions - Mobile Optimized Buttons */}
                <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-100 dark:border-gray-700/50">
                   <div className="flex flex-col sm:flex-row items-center gap-3">
                      {book.status === 'Available' ? (
                        <button 
                          onClick={() => { requestReservation(book.id); }}
                          disabled={reservationRequests.some(r => r.bookId === book.id && r.studentId === currentUser?.id && r.status === 'pending')}
                          className={`w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95
                            ${reservationRequests.some(r => r.bookId === book.id && r.studentId === currentUser?.id && r.status === 'pending')
                              ? 'bg-amber-50 text-amber-600 cursor-not-allowed border border-amber-100' 
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25'}`}
                        >
                          {reservationRequests.some(r => r.bookId === book.id && r.studentId === currentUser?.id && r.status === 'pending') 
                            ? 'Reservation Pending' 
                            : 'Reserve This Book'}
                        </button>
                      ) : (
                        <button disabled className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed font-bold text-sm">
                          Book unavailable
                        </button>
                      )}
                      
                      <button 
                        onClick={() => toggleFavorite(book.id)}
                        className={`p-3.5 rounded-xl border-2 transition-all active:scale-90
                          ${isFavorite 
                            ? 'border-red-100 bg-red-50 text-red-500 dark:border-red-900/30 dark:bg-red-900/20' 
                            : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 dark:border-gray-700'}`}
                        title="Add to Favorites"
                      >
                         <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailField({ label, value }) {
  return (
    <div>
       <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
       <div className="text-sm font-semibold text-gray-900 dark:text-white break-all">{value}</div>
    </div>
  );
}
