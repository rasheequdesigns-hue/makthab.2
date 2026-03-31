import React, { useState } from 'react';
import { useLibraryStore } from '../store/useLibraryStore';
import { 
  Search, BookMarked, Database
} from 'lucide-react';
import BookCard from '../components/BookCard';

export default function GuestView() {
  const { books } = useLibraryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('title');
  
  const categories = ['All', ...new Set(books.map(b => b.category))];
  
  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || book.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'author') return a.author.localeCompare(b.author);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-8 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Standard Page Header - Mobile Optimized */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mt-4 sm:mt-10">
           <div className="min-w-0">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                 <BookMarked size={18} className="shrink-0" />
                 <span className="font-semibold text-xs sm:text-sm uppercase tracking-wider truncate">Digital Catalog</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight truncate">
                Library Explorer
              </h1>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-lg line-clamp-2">
                Browse our collection of books, track availability, and discover your next read in our comprehensive digital ledger.
              </p>
           </div>
           
           <div className="flex items-center gap-2 px-3 sm:px-4 py-2 text-[10px] sm:text-sm font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 w-fit shrink-0">
              <Database size={14} className="sm:size-4" /> Registry Access Active
           </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Search and Filters Bar - Mobile Friendly Grid */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm sticky top-16 sm:top-20 z-40">
             <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
                {/* Search Input */}
                <div className="relative flex-1 w-full group">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                   <input 
                     type="text" 
                     placeholder="Search by title or author..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg py-2.5 sm:py-3 pl-11 sm:pl-12 pr-4 text-xs sm:text-sm font-medium text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400 transition-all shadow-inner"
                   />
                </div>
                
                {/* Select Filters - Stacked on Mobile, side-by-side on sm */}
                <div className="grid grid-cols-2 lg:flex gap-2 sm:gap-4 w-full lg:w-auto">
                   <select 
                     value={selectedStatus}
                     onChange={(e) => setSelectedStatus(e.target.value)}
                     className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                   >
                      <option value="All">All Status</option>
                      <option value="Available">Available Only</option>
                      <option value="Lent Out">Checked Out</option>
                   </select>
                   <select 
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                   >
                      <option value="title">Sort: Title</option>
                      <option value="author">Sort: Author</option>
                   </select>
                </div>
             </div>
             
             {/* Category Pills - Smooth Scroll on Mobile */}
             <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pr-2 shrink-0">Tags:</span>
                <div className="flex gap-2 min-w-max">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide transition-all
                        ${selectedCategory === cat 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 border border-transparent hover:border-gray-300 dark:hover:border-gray-500'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
             </div>
          </div>

          {/* Book Catalog Grid - Fully Adaptive */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="animate-in fade-in zoom-in-95 duration-500">
                 <BookCard book={book} />
              </div>
            ))}
            
            {/* Empty State - Mobile Optimized */}
            {filteredBooks.length === 0 && (
              <div className="col-span-full py-16 sm:py-24 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-center px-6">
                 <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Search className="text-gray-300" size={28} />
                 </div>
                 <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">No matching records</h3>
                 <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xs sm:max-w-sm">
                    Try adjusting your filters or search keywords to find what you're looking for.
                 </p>
                 <button 
                   onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedStatus('All'); }}
                   className="mt-6 py-2 px-4 rounded-lg text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                 >
                   Reset Search Registry
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
