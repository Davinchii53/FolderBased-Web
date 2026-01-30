import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MessageSquare } from 'lucide-react';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

export default function CreateSessionModal({ isOpen, onClose, onCreate }: CreateSessionModalProps) {
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onCreate(title);
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* The Modal Window */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-cyan-300">
                <MessageSquare size={20} />
             </div>
             <h2 className="text-xl font-medium text-white">New Session</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block">Session Name</label>
            <input 
              autoFocus
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Debugging MergeSort" 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <button 
            type="submit"
            disabled={!title}
            className={`w-full py-4 rounded-xl font-medium text-black transition-all ${!title ? 'bg-white/10 text-white/20 cursor-not-allowed' : 'bg-cyan-500 hover:opacity-90 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]'}`}
          >
            Start Chatting
          </button>
        </form>
      </motion.div>
    </div>
  );
}