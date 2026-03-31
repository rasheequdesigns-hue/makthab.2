import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LiquidBackground from './components/LiquidBackground';
import GuestView from './pages/GuestView';
import AdminDashboard from './pages/AdminDashboard';
import StudentProfile from './pages/StudentProfile';
import Login from './pages/Login';
import { useLibraryStore } from './store/useLibraryStore';

function App() {
  const { isAdminAuthenticated, currentUser, theme } = useLibraryStore();
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`relative min-h-screen overflow-x-hidden font-sans bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-white transition-colors duration-700 ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="noise-overlay"></div>
        
        {/* Institutional Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div 
          className="matrix-cursor hidden md:block" 
          style={{ transform: `translate(${cursorPos.x - 10}px, ${cursorPos.y - 10}px)` }}
        ></div>
        
        <div className="crystal-glow-tr"></div>
        <LiquidBackground />
        <Navbar />
        
        <main className="relative z-10 w-full animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={isAdminAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="/profile" element={currentUser ? <StudentProfile /> : <Navigate to="/login" />} />
            <Route path="/" element={currentUser ? <GuestView /> : <Navigate to="/login" />} />
          </Routes>
        </main>
    </div>
  );
}

export default App;
