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

      {/* Discovery Modal - Clear, Readable standard UI */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row relative">
             <button 
               onClick={() => setShowModal(false)} 
               className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
             >
               <X size={20} />
             </button>
             
             {/* Modal Left: Cover Image */}
             <div className="w-full md:w-5/12 bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                {book.coverUrl ? (
                  <img src={book.coverUrl} className="w-full max-w-[240px] shadow-lg rounded-lg object-cover aspect-[3/4]" alt={`${book.title} cover`} />
                ) : (
                  <div className="w-full max-w-[240px] aspect-[3/4] bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-center">
                     <BookOpen size={48} className="text-gray-300" />
                  </div>
                )}
             </div>

             {/* Modal Right: Details */}
             <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col">
                <div className="flex-grow">
                   <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4 font-semibold text-sm">
                      <BookOpen size={18} />
                      <span className="uppercase tracking-wider">Library Detail</span>
                   </div>
                   
                   <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
                     {book.title}
                   </h2>
                   <p className="text-lg text-gray-600 dark:text-gray-300 font-medium mb-8">
                     By {book.author}
                   </p>

                   <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      <DetailField label="Status" value={
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300
                          ${book.status === 'Available' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}
                        `}>
                          {book.status}
                        </span>
                      } />
                      <DetailField label="Category" value={book.category} />
                      <DetailField label="Register ID" value={book.id} />
                      <DetailField label="Borrowed By" value={book.borrowerName || 'Available'} />
                      <DetailField label="Total Pages" value={book.totalPages || 'N/A'} />
                   </div>
                </div>

                {/* Actions */}
                <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                   <div className="flex items-center gap-4">
                      {book.status === 'Available' ? (
                        <button 
                          onClick={() => requestReservation(book.id)}
                          disabled={reservationRequests.some(r => r.bookId === book.id && r.studentId === currentUser?.id && r.status === 'pending')}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                            ${reservationRequests.some(r => r.bookId === book.id && r.studentId === currentUser?.id && r.status === 'pending')
                              ? 'bg-amber-100 text-amber-700 cursor-not-allowed border border-amber-200' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                          {reservationRequests.some(r => r.bookId === book.id && r.studentId === currentUser?.id && r.status === 'pending') 
                            ? 'Pending Approval' 
                            : 'Reserve Book'}
                        </button>
                      ) : (
                        <button disabled className="flex-1 py-3 px-4 rounded-lg bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed font-medium">
                          Join Waitlist
                        </button>
                      )}
                      
                      <button 
                        onClick={() => toggleFavorite(book.id)}
                        className={`p-3 rounded-lg border focus:outline-none transition-colors
                          ${isFavorite 
                            ? 'border-red-200 bg-red-50 text-red-500 dark:border-red-900/50 dark:bg-red-900/20' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                      >
                         <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
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
