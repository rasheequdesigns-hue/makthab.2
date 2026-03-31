import React, { useState, useEffect } from 'react';
import { useLibraryStore } from '../store/useLibraryStore';
import { 
  BookPlus, Users, QrCode, LogOut, Search, 
  Trash2, Edit3, Save, X, Activity, BarChart3, Clock, 
  ChevronRight, MoreHorizontal, ShieldCheck, ScanLine, Camera,
  CheckCircle2, AlertCircle, TrendingUp, Zap, Server, Shield, Download, Library
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function AdminDashboard() {
  const { 
    books, students, isAdminAuthenticated, auditLogs,
    addBook, editBook, deleteBook, lendBook, returnBook, logout,
    addStudent, removeStudent,
    reservationRequests = [], approveReservation, rejectReservation
  } = useLibraryStore();
  
  const [activeTab, setActiveTab] = useState('books');
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', author: '', category: '', coverUrl: '' });
  const [studentForm, setStudentForm] = useState({ name: '', grade: '', admissionNumber: '' });
  const [viewQrModal, setViewQrModal] = useState(null);
  const [lendingModalFor, setLendingModalFor] = useState(null);
  const [lendForm, setLendForm] = useState({ borrowerName: '', lendStartDate: new Date().toISOString().split('T')[0], lendEndDate: '', lendNotes: '' });
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState(null);

  const pendingRequests = reservationRequests.filter(r => r.status === 'pending');

  useEffect(() => {
    if (scanMessage) {
      const timer = setTimeout(() => setScanMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [scanMessage]);

  if (!isAdminAuthenticated) return <Navigate to="/login" replace />;

  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      editBook(isEditing, formData);
      setIsEditing(null);
    } else {
      addBook(formData);
    }
    setFormData({ title: '', author: '', category: '', coverUrl: '' });
  };

  const handleQrScan = (result) => {
    let text = "";
    if (typeof result === 'string') {
      text = result;
    } else if (Array.isArray(result) && result.length > 0) {
      text = result[0]?.rawValue || result[0]?.text;
    } else if (result?.rawValue || result?.text) {
      text = result.rawValue || result.text;
    }

    if (!text) return;

    try {
      const data = JSON.parse(text);
      if (data.title && data.author) {
        addBook({ ...data, status: 'Available' });
        setIsScanning(false);
        setScanMessage({ type: 'success', text: `Added: "${data.title}" successfully.` });
      } else {
        setScanMessage({ type: 'error', text: 'Invalid data format.' });
      }
    } catch (e) {
      setScanMessage({ type: 'error', text: 'Error reading QR data.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
               <Shield className="h-8 w-8 text-blue-600 dark:text-blue-500" /> Administrative Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage library assets, students, and activities.
            </p>
          </div>
          
          <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto no-scrollbar touch-pan-x">
            <div className="flex min-w-max">
              <AdminTab active={activeTab === 'books'} onClick={() => setActiveTab('books')} icon={<BookPlus size={18} />} label="Books" />
              <AdminTab active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Users size={18} />} label="Students" />
              <AdminTab active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} icon={
                <div className="relative">
                  <Clock size={18} />
                  {pendingRequests.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                      {pendingRequests.length}
                    </span>
                  )}
                </div>
              } label="Requests" />
              <AdminTab active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart3 size={18} />} label="Analytics" />
              <AdminTab active={activeTab === 'qrcodes'} onClick={() => setActiveTab('qrcodes')} icon={<QrCode size={18} />} label="QR Codes" />
            </div>
          </div>
        </div>

        {/* Tab Content: Books */}
        {activeTab === 'books' && (
          <div className="space-y-6">
             {/* Add/Edit Form */}
             <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{isEditing ? 'Edit Book' : 'Add New Book'}</h2>
                   <div className="flex gap-2">
                       {!isEditing && (
                         <button 
                           onClick={() => setViewQrModal({ ...formData, id: 'temp' })}
                           className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                         >
                           <QrCode size={16} /> Generate QR
                         </button>
                       )}
                       {!isEditing && (
                         <button 
                           onClick={() => setIsScanning(!isScanning)}
                           className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors
                             ${isScanning ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                         >
                           {isScanning ? <X size={16} /> : <Camera size={16} />} 
                           {isScanning ? 'Stop Scanning' : 'Scan QR'}
                         </button>
                       )}
                   </div>
                </div>

                {scanMessage && (
                  <div className={`mb-6 p-4 rounded-md text-sm text-center border ${scanMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400'}`}>
                    {scanMessage.text}
                  </div>
                )}

                {isScanning ? (
                  <div className="max-w-md mx-auto aspect-video rounded-lg overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-lg relative bg-black">
                     <Scanner onScan={handleQrScan} onError={() => {}} components={{ audio: false }} />
                     <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-red-500 animate-pulse"></div>
                  </div>
                ) : (
                  <form onSubmit={handleBookSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <Field label="Book Title" value={formData.title} onChange={(v) => setFormData({...formData, title: v})} placeholder="Enter title" />
                     <Field label="Author" value={formData.author} onChange={(v) => setFormData({...formData, author: v})} placeholder="Enter author" />
                     <Field label="Category" value={formData.category} onChange={(v) => setFormData({...formData, category: v})} placeholder="e.g. Science Fiction" />
                     <Field label="Cover Image URL" value={formData.coverUrl} onChange={(v) => setFormData({...formData, coverUrl: v})} placeholder="https://..." />
                     
                     <div className="lg:col-span-4 flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                       {isEditing && (
                         <button type="button" onClick={() => { setIsEditing(null); setFormData({title:'',author:'',category:'',coverUrl:''}); }} className="px-5 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                           Cancel
                         </button>
                       )}
                       <button type="submit" className="px-6 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors">
                         {isEditing ? 'Save Changes' : 'Add Book'}
                       </button>
                     </div>
                  </form>
                )}
             </div>

             {/* Books List Grid Table View */}
             <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto selection:bg-blue-100">
                   <table className="min-w-[600px] w-full text-left text-sm text-gray-600 dark:text-gray-300">
                      <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                         <tr>
                            <th className="px-4 sm:px-6 py-4">Book Details</th>
                            <th className="px-4 sm:px-6 py-4">Status</th>
                            <th className="px-4 sm:px-6 py-4 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                         {books.length === 0 && (
                            <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-500">No books found in the registry.</td></tr>
                         )}
                         {books.map(book => (
                           <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                              <td className="px-4 sm:px-6 py-4">
                                 <div className="flex items-center gap-3 sm:gap-4">
                                    {book.coverUrl ? (
                                      <img src={book.coverUrl} className="w-10 sm:w-12 h-14 sm:h-16 object-cover rounded shadow-sm border border-gray-100 dark:border-gray-600 shrink-0" />
                                    ) : (
                                      <div className="w-10 sm:w-12 h-14 sm:h-16 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded flex items-center justify-center shadow-sm shrink-0">
                                         <BookPlus size={16} className="text-gray-400" />
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                       <div className="font-medium text-gray-900 dark:text-white truncate">{book.title}</div>
                                       <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{book.author} • {book.category}</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 align-middle">
                                 <button 
                                   onClick={() => book.status === 'Lent Out' ? returnBook(book.id) : setLendingModalFor(book)}
                                   className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap
                                     ${book.status === 'Lent Out' 
                                       ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50' 
                                       : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'}`}
                                 >
                                   {book.status === 'Lent Out' ? `Lent to: ${book.borrowerName}` : 'Available'}
                                 </button>
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-right align-middle text-gray-400 dark:text-gray-500">
                                 <div className="flex items-center justify-end gap-1 sm:gap-2">
                                    <button onClick={() => setViewQrModal(book)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="View QR"><ScanLine size={16} /></button>
                                    <button onClick={() => { setIsEditing(book.id); setFormData(book); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Edit"><Edit3 size={16} /></button>
                                    <button onClick={() => {if(window.confirm('Delete this book?')) deleteBook(book.id)}} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete"><Trash2 size={16} /></button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {/* Tab Content: Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
             <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                   <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reservation Requests</h2>
                   <p className="text-sm text-gray-500 dark:text-gray-400">Review and manage book reservation requests from students.</p>
                </div>
                <div className="overflow-x-auto">
                   <table className="min-w-[700px] w-full text-left text-sm text-gray-600 dark:text-gray-300">
                      <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                         <tr>
                            <th className="px-4 sm:px-6 py-4">Book Title</th>
                            <th className="px-4 sm:px-6 py-4">Student Name</th>
                            <th className="px-4 sm:px-6 py-4">Requested date</th>
                            <th className="px-4 sm:px-6 py-4">Status</th>
                            <th className="px-4 sm:px-6 py-4 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                         {reservationRequests.length === 0 && (
                            <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No reservation requests found.</td></tr>
                         )}
                         {[...reservationRequests].reverse().map(request => (
                           <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                              <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 dark:text-white">
                                 {request.bookTitle}
                              </td>
                              <td className="px-4 sm:px-6 py-4">
                                 {request.studentName}
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-[10px] sm:text-xs text-gray-500">
                                 {new Date(request.timestamp).toLocaleString()}
                              </td>
                              <td className="px-4 sm:px-6 py-4">
                                 <span className={`px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider
                                   ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                     request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                     'bg-red-100 text-red-800'}`}>
                                   {request.status}
                                 </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-right">
                                 {request.status === 'pending' && (
                                   <div className="flex justify-end gap-1 sm:gap-2">
                                      <button 
                                        onClick={() => approveReservation(request.id)}
                                        className="px-2 sm:px-3 py-1 bg-green-600 text-white rounded text-[10px] sm:text-xs font-medium hover:bg-green-700 transition-colors"
                                      >
                                        Approve
                                      </button>
                                      <button 
                                        onClick={() => rejectReservation(request.id)}
                                        className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded text-[10px] sm:text-xs font-medium hover:bg-red-700 transition-colors"
                                      >
                                        Reject
                                      </button>
                                   </div>
                                 )}
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {/* Tab Content: Students */}
        {activeTab === 'students' && (
          <div className="space-y-6">
             {/* Add Student Form */}
             <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Register Student</h2>
                <form onSubmit={(e) => { e.preventDefault(); addStudent(studentForm); setStudentForm({name:'',grade:'',admissionNumber:''}); }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <Field label="Full Name" value={studentForm.name} onChange={(v) => setStudentForm({...studentForm, name: v})} placeholder="Student Name" />
                   <Field label="Grade/Class" value={studentForm.grade} onChange={(v) => setStudentForm({...studentForm, grade: v})} placeholder="e.g. 10th Grade" />
                   <Field label="Admission Number" value={studentForm.admissionNumber} onChange={(v) => setStudentForm({...studentForm, admissionNumber: v})} placeholder="Unique ID" />
                   <div className="md:col-span-3 flex justify-end mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button type="submit" className="px-6 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors">Add Student</button>
                   </div>
                </form>
             </div>

             {/* Students List */}
             <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                   <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                         <th className="px-6 py-4">Student Details</th>
                         <th className="px-6 py-4">Grade</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {students.length === 0 && <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-500">No students registered.</td></tr>}
                      {students.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 group transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                                  {student.name[0]}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">ID: {student.admissionNumber}</div>
                                </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 align-middle">
                              <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium">{student.grade}</span>
                           </td>
                           <td className="px-6 py-4 text-right align-middle text-gray-400 dark:text-gray-500">
                              <div className="flex items-center justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button onClick={() => removeStudent(student.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md hover:text-red-600 dark:hover:text-red-400" title="Remove"><Trash2 size={18} /></button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* Tab Content: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Books" value={books.length} icon={<Library className="text-blue-500 dark:text-blue-400" size={24} />} />
                <StatCard label="Registered Students" value={students.length} icon={<Users className="text-purple-500 dark:text-purple-400" size={24} />} />
                <StatCard label="Books Lent Out" value={books.filter(b=>b.status==='Lent Out').length} icon={<TrendingUp className="text-green-500 dark:text-green-400" size={24} />} />
             </div>

             <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Activity size={18}/> Activity Log</h2>
                   <button onClick={() => {
                     const csv = auditLogs.map(l => `${l.timestamp},${l.action},${l.details}`).join('\n');
                     const blob = new Blob([csv], { type: 'text/csv' });
                     const url = URL.createObjectURL(blob);
                     const a = document.createElement('a');
                     a.href = url;
                     a.download = 'library_activity_log.csv';
                     a.click();
                   }} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
                     <Download size={16} /> Export CSV
                   </button>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hide-scrollbar max-h-96 overflow-y-auto">
                   <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                      <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 sticky top-0">
                         <tr>
                            <th className="px-6 py-3">Time</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3 flex-1">Details</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                         {auditLogs.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-500">No recent activity.</td></tr>}
                         {auditLogs.map((log, i) => (
                           <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                              <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                              <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                                <span className="inline-flex items-center gap-1.5"><Badge action={log.action} /> {log.action}</span>
                              </td>
                              <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{log.details}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {/* Tab Content: QR Codes */}
        {activeTab === 'qrcodes' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-10">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                   <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">QR Tag Generator</h2>
                   <p className="text-sm text-gray-500 dark:text-gray-400">Manage tags for all database items or print custom tags.</p>
                </div>
                <button 
                  onClick={() => setViewQrModal({ title: 'New Asset', author: 'Library', category: 'General', coverUrl: '', id: 'custom' })} 
                  className="px-5 py-2.5 rounded-md text-sm font-medium bg-blue-600 text-white shadow-sm hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                   <QrCode size={16} /> Create Custom Label
                </button>
             </div>

             {books.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                   <QrCode size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                   <p className="text-gray-900 dark:text-white font-medium">No books in the catalog</p>
                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add items to easily generate their inventory labels.</p>
                </div>
             ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                   {books.map(book => (
                     <div key={book.id} onClick={() => setViewQrModal(book)} className="cursor-pointer border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all bg-gray-50 dark:bg-gray-700/30">
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 mb-4 inline-block">
                           <QRCodeSVG value={JSON.stringify({title: book.title, author: book.author, category: book.category, coverUrl: book.coverUrl})} size={80} />
                        </div>
                        <span className="text-xs font-medium text-gray-900 dark:text-white text-center line-clamp-2 w-full leading-tight">{book.title}</span>
                     </div>
                   ))}
                   <div className="col-span-full mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                      <button onClick={() => window.print()} className="px-6 py-2.5 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
                        <ScanLine size={16}/> Print All Directory Tags
                      </button>
                   </div>
                </div>
             )}
          </div>
        )}
      </div>

      {/* QR Code Modal Overlay */}
      {viewQrModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm shadow-2xl">
           <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl max-w-sm w-full shadow-2xl relative border border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setViewQrModal(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white p-2"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white text-center">
                {viewQrModal.id === 'custom' || viewQrModal.id === 'temp' ? 'Label Editor' : 'Item Tag'}
              </h3>
              
              <div className="flex justify-center mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                   <QRCodeSVG 
                     value={JSON.stringify({title: viewQrModal.title, author: viewQrModal.author, category: viewQrModal.category, coverUrl: viewQrModal.coverUrl})} 
                     size={200} 
                   />
                </div>
              </div>
              
              {viewQrModal.id === 'custom' || viewQrModal.id === 'temp' ? (
                <div className="space-y-4 mb-8">
                   <input 
                     value={viewQrModal.title} 
                     onChange={(e) => setViewQrModal({...viewQrModal, title: e.target.value})} 
                     className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-3 text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                     placeholder="Item Title"
                   />
                   <input 
                     value={viewQrModal.author} 
                     onChange={(e) => setViewQrModal({...viewQrModal, author: e.target.value})} 
                     className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-3 text-sm text-gray-500 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" 
                     placeholder="Item Details / Author"
                   />
                </div>
              ) : (
                <div className="text-center mb-8">
                  <p className="font-bold text-lg text-gray-900 dark:text-white mb-1">{viewQrModal.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{viewQrModal.author}</p>
                </div>
              )}

              <button 
                onClick={() => window.print()} 
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <ScanLine size={18} /> Print Label
              </button>
           </div>
        </div>
      )}

      {/* Lending Modal Overlay */}
      {lendingModalFor && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm shadow-2xl animate-in zoom-in-95 duration-200">
           <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl max-w-sm w-full shadow-2xl relative border border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setLendingModalFor(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white p-2"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-2"><BookPlus size={20} className="text-blue-500"/> Lend Book</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border border-gray-100 dark:border-gray-600">
                 Selected Title: <strong className="text-gray-900 dark:text-white">{lendingModalFor.title}</strong>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); lendBook(lendingModalFor.id, lendForm); setLendingModalFor(null); }} className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Borrower</label>
                    <select 
                      required 
                      value={lendForm.borrowerName} 
                      onChange={(e) => setLendForm({...lendForm, borrowerName: e.target.value})} 
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                       <option value="">Choose a registered student...</option>
                       {students.map(s => <option key={s.id} value={s.name}>{s.name} (Grade: {s.grade})</option>)}
                    </select>
                 </div>
                 <button type="submit" className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">Confirm Lend</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

// Subcomponents simplified to standard UI styles
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-5 slide-in-from-bottom-5 animate-in fade-in duration-500">
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function Badge({ action }) {
  if (action.includes('Book Added')) return <div className="w-2 h-2 rounded-full bg-blue-500"></div>;
  if (action.includes('Lent')) return <div className="w-2 h-2 rounded-full bg-yellow-500"></div>;
  if (action.includes('Deleted')) return <div className="w-2 h-2 rounded-full bg-red-500"></div>;
  if (action.includes('Returned')) return <div className="w-2 h-2 rounded-full bg-green-500"></div>;
  return <div className="w-2 h-2 rounded-full bg-gray-500"></div>;
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-1.5">
       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
       <input 
         required 
         value={value} 
         onChange={(e) => onChange(e.target.value)} 
         placeholder={placeholder} 
         className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow placeholder-gray-400 dark:placeholder-gray-500" 
       />
    </div>
  );
}

function AdminTab({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 rounded-md whitespace-nowrap outline-none
        ${active 
          ? 'bg-white text-gray-900 dark:bg-gray-700 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700/30'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
