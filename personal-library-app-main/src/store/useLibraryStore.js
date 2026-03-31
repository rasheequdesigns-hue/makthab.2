import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLibraryStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      books: [],
      students: [],
      auditLogs: [],
      readingGoals: {}, 
      favorites: [], // Simplified for this context
      isAdminAuthenticated: false,
      currentUser: null, 
      reservationRequests: [],

      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      logAction: (action, details) => set((state) => ({
        auditLogs: [{ id: Date.now().toString(), action, details, timestamp: new Date().toISOString() }, ...state.auditLogs].slice(0, 50)
      })),

      addBook: (book) => {
        const id = Date.now().toString();
        set((state) => ({ books: [...state.books, { ...book, id, currentPage: 0, totalPages: 100, quotes: [], status: 'Available' }] }));
        get().logAction('Book Added', `Title: ${book.title}`);
      },
      editBook: (id, updatedData) => {
        set((state) => ({
          books: state.books.map((book) => book.id === id ? { ...book, ...updatedData } : book)
        }));
        get().logAction('Book Updated', `ID: ${id}`);
      },
      deleteBook: (id) => {
        const book = get().books.find(b => b.id === id);
        set((state) => ({ books: state.books.filter((book) => book.id !== id) }));
        get().logAction('Book Deleted', `Title: ${book?.title}`);
      },
      lendBook: (id, details) => {
        set((state) => ({
          books: state.books.map((book) => 
            book.id === id 
              ? { ...book, status: 'Lent Out', ...details } 
              : book
          )
        }));
        get().logAction('Book Lent', `To: ${details.borrowerName}`);
      },
      returnBook: (id) => set((state) => {
        const book = state.books.find((b) => b.id === id);
        const name = book?.borrowerName;
        get().logAction('Book Returned', `Title: ${book?.title}`);
        return {
          books: state.books.map((b) => 
            b.id === id 
              ? { ...b, status: 'Available', borrowerName: '', lendStartDate: '', lendEndDate: '', lendNotes: '' } 
              : b
          ),
          students: name ? state.students.map((s) => s.name === name ? { ...s, readHistory: [...new Set([...(s.readHistory || []), book.title])] } : s) : state.students
        };
      }),

      requestReservation: (bookId) => {
        const { currentUser, books, reservationRequests } = get();
        if (!currentUser) return;
        
        const book = books.find(b => b.id === bookId);
        if (!book || book.status !== 'Available') return;

        // Check if already requested
        const alreadyRequested = reservationRequests.find(r => r.bookId === bookId && r.studentId === currentUser.id && r.status === 'pending');
        if (alreadyRequested) return;

        const newRequest = {
          id: Date.now().toString(),
          bookId,
          bookTitle: book.title,
          studentId: currentUser.id,
          studentName: currentUser.name,
          status: 'pending',
          timestamp: new Date().toISOString()
        };

        set((state) => ({
          reservationRequests: [...state.reservationRequests, newRequest]
        }));
        get().logAction('Reservation Requested', `Book: ${book.title} by ${currentUser.name}`);
      },

      approveReservation: (requestId) => {
        const { reservationRequests, books } = get();
        const request = reservationRequests.find(r => r.id === requestId);
        if (!request) return;

        const book = books.find(b => b.id === request.bookId);
        if (!book) return;

        // Update book status and set borrower
        set((state) => ({
          books: state.books.map(b => b.id === request.bookId ? { 
            ...b, 
            status: 'Lent Out', 
            borrowerName: request.studentName,
            borrowerId: request.studentId,
            lendStartDate: new Date().toISOString().split('T')[0]
          } : b),
          reservationRequests: state.reservationRequests.map(r => r.id === requestId ? { ...r, status: 'approved' } : r)
        }));

        get().logAction('Reservation Approved', `Book: ${request.bookTitle} for ${request.studentName}`);
      },

      rejectReservation: (requestId) => {
        set((state) => ({
          reservationRequests: state.reservationRequests.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r)
        }));
        const request = get().reservationRequests.find(r => r.id === requestId);
        get().logAction('Reservation Rejected', `Book: ${request?.bookTitle} for ${request?.studentName}`);
      },

      toggleFavorite: (bookId) => set((state) => {
        const isFav = state.favorites.includes(bookId);
        return {
          favorites: isFav ? state.favorites.filter(id => id !== bookId) : [...state.favorites, bookId]
        };
      }),
      
      addStudent: (student) => set((state) => ({ students: [...state.students, { ...student, id: Date.now().toString(), readHistory: [] }] })),
      removeStudent: (id) => set((state) => ({ students: state.students.filter((s) => s.id !== id) })),

      login: (username, credential, role) => {
        if (role === 'admin' && username === 'admin' && credential === 'admin123') {
          set({ isAdminAuthenticated: true, currentUser: { id: 'admin', name: 'Admin', role: 'admin' } });
          return true;
        }
        const student = get().students.find(s => s.name === username && s.admissionNumber === credential);
        if (student) {
          set({ isAdminAuthenticated: false, currentUser: { ...student, role: 'student' } });
          return true;
        }
        return false;
      },
      logout: () => set({ isAdminAuthenticated: false, currentUser: null }),
    }),
    {
      name: 'library-store-v3',
    }
  )
);
