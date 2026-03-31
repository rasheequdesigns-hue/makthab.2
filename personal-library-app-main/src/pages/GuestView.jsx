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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Standard Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mt-10">
           <div>
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                 <BookMarked size={20} />
                 <span className="font-semibold text-sm uppercase tracking-wider">Digital Catalog</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Library Explorer
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-lg">
                Browse our collection of books, track availability, and discover your next read in our comprehensive digital ledger.
              </p>
           </div>
           
           <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
              <Database size={16} /> Registry Access Active
           </div>
        </div>

        <div className="space-y-8">
          {/* Search and Filters Bar */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm sticky top-20 z-40">
             <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                   <input 
                     type="text" 
                     placeholder="Search books by title or author..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg py-3 pl-12 pr-4 text-sm font-medium text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-shadow"
                   />
                </div>
                
                {/* Select Filters */}
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                   <select 
                     value={selectedStatus}
                     onChange={(e) => setSelectedStatus(e.target.value)}
                     className="w-full sm:w-48 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                      <option value="All">All Status</option>
                      <option value="Available">Available Only</option>
                      <option value="Lent Out">Checked Out</option>
                   </select>
                   <select 
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="w-full sm:w-48 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                      <option value="title">Sort: Title</option>
                      <option value="author">Sort: Author</option>
                   </select>
                </div>
             </div>
             
             {/* Category Pills */}
             <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider pr-2">Categories:</span>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap
                      ${selectedCategory === cat 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>

          {/* Book Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id}>
                 <BookCard book={book} />
              </div>
            ))}
            
            {/* Empty State */}
            {filteredBooks.length === 0 && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-center px-4">
                 <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Search className="text-gray-400" size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No books found</h3>
                 <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                    We couldn't find any books matching your current search and filters. Check your spelling or try clearing the filters.
                 </p>
                 <button 
                   onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedStatus('All'); }}
                   className="mt-6 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                 >
                   Clear all filters
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
