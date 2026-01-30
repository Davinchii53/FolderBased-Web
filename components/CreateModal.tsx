import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Cpu, Globe, Code, Zap, Palette } from 'lucide-react';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, subtitle: string, color: string, icon: string) => void;
}

export default function CreateModal({ isOpen, onClose, onCreate }: CreateModalProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('cyan');
  const [selectedIcon, setSelectedIcon] = useState('cpu');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onCreate(title, subtitle, selectedColor, selectedIcon);
    // Reset form
    setTitle('');
    setSubtitle('');
    onClose();
  };

  const colors = [
    { id: 'cyan', bg: 'bg-cyan-500' },
    { id: 'purple', bg: 'bg-purple-500' },
    { id: 'emerald', bg: 'bg-emerald-500' },
  ];

  const icons = [
    { id: 'cpu', icon: <Cpu size={20} /> },
    { id: 'globe', icon: <Globe size={20} /> },
    { id: 'code', icon: <Code size={20} /> },
    { id: 'zap', icon: <Zap size={20} /> },
  ];

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
        {/* Decorative Glow */}
        <div className={`absolute top-0 left-0 w-full h-2 bg-${selectedColor}-500 shadow-[0_0_20px_rgba(var(--tw-shadow-color))]`}></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-white">New Context</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block">Project Name</label>
              <input 
                autoFocus
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mobile App Dev" 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block">Subtitle</label>
              <input 
                type="text" 
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Flutter & Dart" 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-2">
               <Palette size={14} /> Theme Color
            </label>
            <div className="flex gap-3">
               {colors.map((c) => (
                 <button
                   key={c.id}
                   type="button"
                   onClick={() => setSelectedColor(c.id)}
                   className={`w-10 h-10 rounded-full ${c.bg} border-2 transition-all ${selectedColor === c.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                 />
               ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block">Icon</label>
            <div className="flex gap-3">
               {icons.map((i) => (
                 <button
                   key={i.id}
                   type="button"
                   onClick={() => setSelectedIcon(i.id)}
                   className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${selectedIcon === i.id ? 'bg-white/20 border-white text-white' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                 >
                   {i.icon}
                 </button>
               ))}
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={!title}
            className={`w-full py-4 rounded-xl font-medium text-black transition-all ${!title ? 'bg-white/10 text-white/20 cursor-not-allowed' : `bg-${selectedColor}-500 hover:opacity-90 hover:shadow-lg`}`}
          >
            Create Context
          </button>
        </form>
      </motion.div>
    </div>
  );
}