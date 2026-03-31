import React, { useState } from 'react';
import { useLibraryStore } from '../store/useLibraryStore';
import { useNavigate } from 'react-router-dom';
import { Shield, Loader2, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useLibraryStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAuthorizing(true);
    setError(null);

    setTimeout(() => {
      const success = login(formData.username, formData.password, activeTab);
      if (success) {
        navigate(activeTab === 'admin' ? '/admin' : '/');
      } else {
        setError('Invalid username or password.');
        setIsAuthorizing(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 sm:p-10 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-3">
             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Shield className="h-7 w-7 text-blue-600 dark:text-blue-500" />
             </div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in to your account</h1>
             <p className="text-sm text-gray-500 dark:text-gray-400">Library Management System</p>
          </div>

          {/* Role Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
            <button 
              type="button"
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all
                ${activeTab === 'student' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              Student
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all
                ${activeTab === 'admin' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              Admin
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Enter your username" 
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})} 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 dark:placeholder-gray-400" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input 
                  required 
                  type="password" 
                  placeholder="Enter your password" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 dark:placeholder-gray-400" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isAuthorizing} 
              className={`w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg text-white font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                ${isAuthorizing ? 'bg-blue-400 dark:bg-blue-500/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'}`}
            >
              {isAuthorizing ? (
                <> <Loader2 className="animate-spin h-5 w-5" /> Signing in... </>
              ) : (
                <> Sign in <ArrowRight className="h-5 w-5" /> </>
              )}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}
