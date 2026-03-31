import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, Terminal, Zap } from 'lucide-react';

export default function MatrixAnalyst() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'ANALYST ONLINE. Specialist identity recognized. How can I assist with your matrix extraction today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      const responses = [
        "PROTOCOL UPDATE: Your reading velocity is within the top 5% of this sector.",
        "ANALYSIS: 'Clean Code' node is highly recommended for your current programming sync.",
        "ALERT: New asset pulse detected in the 'Design' matrix.",
        "SYNC COMPLETE: Your next reading goal milestone is 80% achieved."
      ];
      const randomMsg = { role: 'assistant', text: responses[Math.floor(Math.random() * responses.length)] };
      setMessages(prev => [...prev, randomMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-10 right-10 z-[110] flex flex-col items-end">
      {isOpen && (
        <div className="apple-glass-thick w-[380px] h-[520px] mb-6 rounded-[3rem] border-white dark:border-white/10 shadow-[0_45px_90px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-700">
           {/* Header */}
           <div className="p-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white/20 dark:bg-black/20">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center animate-pulse">
                    <Sparkles size={20} />
                 </div>
                 <div>
                    <h4 className="text-[10px] font-semibold text-black dark:text-white">Matrix Analyst</h4>
                    <span className="text-[8px] font-semibold text-green-500">Signal Stable</span>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-all"><X size={20} /></button>
           </div>

           {/* Core Stream */}
           <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] p-5 rounded-[2rem] text-[11px] font-bold leading-relaxed
                      ${m.role === 'user' 
                        ? 'bg-black text-white dark:bg-white dark:text-black rounded-tr-none shadow-xl' 
                        : 'apple-glass text-black dark:text-white rounded-tl-none border-white/50 dark:border-white/5'}`}>
                      {m.text}
                   </div>
                </div>
              ))}
           </div>

           {/* Input Protocol */}
           <form onSubmit={handleSend} className="p-6 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/5 relative">
              <input 
                type="text" 
                placeholder="Query analyst..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-white/60 dark:bg-black/60 rounded-full py-4 pl-6 pr-16 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 border border-white dark:border-white/10 text-black dark:text-white"
              />
              <button type="submit" className="absolute right-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                 <Send size={14} />
              </button>
           </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-[2.5rem] bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-2xl transition-all duration-700 hover:scale-110 hover:-rotate-6 active:scale-90
          ${isOpen ? 'rotate-90' : 'animate-bounce'}`}
      >
        {isOpen ? <X size={28} /> : <Sparkles size={28} />}
      </button>
    </div>
  );
}
