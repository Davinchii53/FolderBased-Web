import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, title, description }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* The Modal Window */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
      >
        {/* Red Danger Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)]"></div>

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
                <AlertTriangle size={24} />
             </div>
             <div>
                <h2 className="text-xl font-medium text-white">{title}</h2>
                <p className="text-sm text-white/50 mt-1">{description}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-3 mt-8">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-medium text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-3 rounded-xl font-medium text-white bg-red-500/80 hover:bg-red-500 border border-red-500 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}