"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Globe, Code, ArrowUpRight, Search, Plus, Zap, LayoutGrid, X, 
  CheckCircle2, Circle, MessageSquare, ChevronLeft, Send, MoreVertical, Trash2,
  FolderOpen
} from 'lucide-react';

import CreateModal from '../components/CreateModal';
import CreateSessionModal from '../components/CreateSessionModal';
import DeleteModal from '../components/DeleteModal';

import { useProjects } from '../hooks/useProjects'; 
import { Project, Task, ChatSession } from '../types';

export default function CrystalDashboard() {
  const { 
    projects, loading, updateProject, createProject, deleteProject, 
    addTask, deleteTask, 
    addChatSession, deleteChatSession 
  } = useProjects();
  
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ 
    type: 'project' | 'task' | 'chat'; 
    id: string; 
    secondaryId?: string; 
    title: string; 
  } | null>(null);

  const [isTypingTask, setIsTypingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");

  const getProgress = (tasks: Task[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const toggleTask = (e: React.MouseEvent, projectId: string, taskId: string) => {
    e.stopPropagation(); 
    const projectToUpdate = projects.find(p => p.id === projectId);
    if (!projectToUpdate) return;

    const updatedTasks = projectToUpdate.tasks.map(t => 
       t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const updatedProject = { ...projectToUpdate, tasks: updatedTasks };

    updateProject(updatedProject);
    if (activeProject && activeProject.id === projectId) {
       setActiveProject(updatedProject);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim() || !activeProject) return;
    const updated = await addTask(activeProject.id, newTaskText);
    if (updated) setActiveProject(updated);
    setNewTaskText("");
    setIsTypingTask(false);
  };

  const requestDeleteProject = () => {
    if (!activeProject) return;
    setDeleteTarget({
      type: 'project',
      id: activeProject.id,
      title: activeProject.title
    });
  };

  const requestDeleteTask = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    if (!activeProject) return;
    setDeleteTarget({
      type: 'task',
      id: taskId,
      secondaryId: activeProject.id,
      title: 'this task'
    });
  };

  const requestDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (!activeProject) return;
    setDeleteTarget({
      type: 'chat',
      id: chatId,
      secondaryId: activeProject.id,
      title: 'this session'
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'project') {
      await deleteProject(deleteTarget.id);
      setActiveProject(null);
    } 
    else if (deleteTarget.type === 'task' && deleteTarget.secondaryId) {
      const updated = await deleteTask(deleteTarget.secondaryId, deleteTarget.id);
      if (updated) setActiveProject(updated);
    } 
    else if (deleteTarget.type === 'chat' && deleteTarget.secondaryId) {
      const updated = await deleteChatSession(deleteTarget.secondaryId, deleteTarget.id);
      if (updated) setActiveProject(updated);
    }
    setDeleteTarget(null);
  };

  const handleOpenSessionModal = () => {
    if (!activeProject) return;
    setIsSessionModalOpen(true);
  };

  const handleCreateSession = async (title: string) => {
    if (!activeProject) return;
    const updated = await addChatSession(activeProject.id, title);
    if (updated) setActiveProject(updated);
  };

  const getColor = (color: string) => {
    const map: any = {
      cyan: { text: 'text-cyan-300', bg: 'bg-cyan-500', border: 'border-cyan-500', shadow: 'shadow-cyan-500' },
      purple: { text: 'text-purple-300', bg: 'bg-purple-500', border: 'border-purple-500', shadow: 'shadow-purple-500' },
      emerald: { text: 'text-emerald-300', bg: 'bg-emerald-500', border: 'border-emerald-500', shadow: 'shadow-emerald-500' },
    };
    return map[color] || map.cyan;
  };

  const getIcon = (name: string, className: string) => {
    if (name === 'cpu') return <Cpu className={className} />;
    if (name === 'globe') return <Globe className={className} />;
    return <Code className={className} />;
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white/50">Loading Crystal OS...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>

      <div className="fixed inset-0 z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[0%] right-[0%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[100px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 flex flex-col h-screen">
        
        <header className="flex justify-between items-center mb-2 shrink-0">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center backdrop-blur-md">
                 <span className="font-bold">46</span>
              </div>
              <div>
                 <h1 className="font-medium text-lg tracking-wide">Workspace</h1>
                 <div className="text-xs text-white/40 font-light">Welcome back, Student.</div>
              </div>
           </div>
           <div className="flex gap-3">
              <button className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"><Search size={18} className="text-white/70" /></button>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all text-cyan-300 backdrop-blur-md hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                 <Plus size={18} />
                 <span className="text-sm font-medium">New Context</span>
              </button>
           </div>
        </header>

        <AnimatePresence mode="wait">
          {!activeProject ? (
            
            /* --- DASHBOARD LOGIC --- */
            projects.length === 0 ? (
              // 1. EMPTY STATE (When no projects exist)
              <motion.div 
                 key="empty"
                 initial={{ opacity: 0, scale: 0.95 }} 
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex-1 flex flex-col items-center justify-center pb-20 text-center"
              >
                 <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
                    <FolderOpen size={48} className="text-white/20" />
                 </div>
                 <h2 className="text-2xl font-light text-white mb-2">Nothing to see here</h2>
                 <p className="text-white/40 max-w-sm mb-8">Your digital workspace is empty. Create a new context to start tracking your projects.</p>
                 <button 
                   onClick={() => setIsModalOpen(true)}
                   className="px-8 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-medium transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                 >
                   Create Context
                 </button>
              </motion.div>
            ) : (
              // 2. GRID STATE (When projects exist)
              <motion.div 
                 key="dashboard"
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1 overflow-y-auto pb-32 pr-2 custom-scrollbar pt-4"
              >
                 {projects.map((project, index) => {
                   const progress = getProgress(project.tasks);
                   const isLarge = index === 0;
                   const theme = getColor(project.color);
                   
                   return (
                     <motion.div 
                        layoutId={`card-${project.id}`}
                        key={project.id} 
                        onClick={() => setActiveProject(project)}
                        className={`${isLarge ? 'col-span-1 md:col-span-2 row-span-2 p-8' : 'col-span-1 p-6 h-64'} flex flex-col justify-between rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md cursor-pointer group relative overflow-hidden`}
                        whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.2)' }}
                     >
                        <div className="flex justify-between items-start z-10 relative">
                           <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${theme.text}`}>
                              {getIcon(project.icon, `text-${project.color}-300`)}
                           </div>
                           <div className="text-xs px-2 py-1 rounded-md border border-white/10 text-white/40">{project.status}</div>
                        </div>

                        <div className="z-10 relative">
                           <motion.h3 layoutId={`title-${project.id}`} className={`${isLarge ? 'text-3xl' : 'text-xl'} font-light mb-1`}>{project.title}</motion.h3>
                           <p className="text-white/50 text-sm mb-4">{project.subtitle}</p>
                           <div className="space-y-2">
                             <div className="flex justify-between text-xs font-medium tracking-wider text-white/60">
                                <span>PROGRESS</span>
                                <span>{progress}%</span>
                             </div>
                             <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <motion.div layoutId={`progress-${project.id}`} className={`h-full ${theme.bg}`} style={{ width: `${progress}%`, boxShadow: `0 0 10px var(--tw-shadow-color)` }}></motion.div>
                             </div>
                          </div>
                        </div>
                        <div className={`absolute -bottom-10 -right-10 w-40 h-40 ${theme.bg} opacity-10 blur-[60px] rounded-full pointer-events-none group-hover:opacity-20 transition-opacity`}></div>
                     </motion.div>
                   );
                 })}
                 
                 {/* SYSTEM HEALTH - Only shows if projects exist */}
                 <div className="col-span-1 md:col-span-1 rounded-[2rem] p-6 bg-black/40 border border-white/5 backdrop-blur-md flex flex-col justify-center gap-4">
                    <div className="flex items-center gap-3 text-white/80"><Zap size={20} className="text-yellow-400" /><span className="font-medium">System Health</span></div>
                    <div className="text-xs text-white/40">Tokens Saved: <span className="text-green-400 font-mono">14,203</span></div>
                 </div>
              </motion.div>
            )

          ) : (
            
            /* --- EXPANDED VIEW --- */
            <motion.div 
               layoutId={`card-${activeProject.id}`}
               key="expanded"
               className="flex-1 flex flex-col bg-[#0A0A0A] rounded-[2rem] border border-white/10 overflow-hidden relative z-50 mb-6"
            >
               <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                 <div className="flex items-center gap-4">
                    <button onClick={() => {setActiveProject(null); setActiveChat(null);}} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"><LayoutGrid size={20} /></button>
                    <div className="h-8 w-[1px] bg-white/10"></div>
                    <div className="flex items-center gap-3">
                       {getIcon(activeProject.icon, `text-${activeProject.color}-300`)}
                       <motion.h2 layoutId={`title-${activeProject.id}`} className="text-xl font-medium">{activeProject.title}</motion.h2>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                   <button 
                     onClick={requestDeleteProject}
                     className="p-2 hover:bg-red-500/10 rounded-full transition-colors text-white/30 hover:text-red-500"
                     title="Delete Context"
                   >
                      <Trash2 size={20} />
                   </button>
                   
                   <button onClick={() => {setActiveProject(null); setActiveChat(null);}} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                      <X size={20} />
                   </button>
                 </div>
               </div>

               <div className="flex-1 flex gap-0 md:gap-6 p-0 md:p-6 overflow-hidden">
                  
                  {/* Milestones */}
                  <div className="w-1/3 border-r border-white/5 md:border md:border-white/10 md:rounded-[2rem] md:bg-white/5 p-6 flex flex-col">
                     <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Milestones</h3>
                     <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                        {activeProject.tasks.map((task) => (
                          <div 
                            key={task.id}
                            onClick={(e) => toggleTask(e, activeProject.id, task.id)}
                            className={`relative p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 group ${task.completed ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                          >
                             {task.completed ? <CheckCircle2 size={20} className="text-green-400 shrink-0" /> : <Circle size={20} className="text-white/20 group-hover:text-white/50 shrink-0" />}
                             <span className={`text-sm flex-1 truncate ${task.completed ? 'text-green-200 line-through' : 'text-white/80'}`}>{task.text}</span>
                             
                             <button 
                               onClick={(e) => requestDeleteTask(e, task.id)}
                               className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded text-white/30 hover:text-red-400 transition-all absolute right-2"
                             >
                                <Trash2 size={14} />
                             </button>
                          </div>
                        ))}
                     </div>

                     {isTypingTask ? (
                        <form onSubmit={handleAddTask} className="mt-4">
                           <input 
                             autoFocus
                             type="text" 
                             value={newTaskText}
                             onChange={(e) => setNewTaskText(e.target.value)}
                             onBlur={() => !newTaskText && setIsTypingTask(false)} 
                             placeholder="What needs to be done?"
                             className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none placeholder-white/20"
                           />
                           <div className="text-[10px] text-white/30 mt-2 pl-1">Press Enter to save</div>
                        </form>
                     ) : (
                        <button 
                          onClick={() => setIsTypingTask(true)}
                          className="mt-4 w-full py-3 rounded-xl border border-dashed border-white/10 text-white/30 text-sm hover:bg-white/5 hover:text-white/60 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus size={16} /> Add Task
                        </button>
                     )}
                  </div>

                  {/* Chat / Context Column */}
                  <div className="flex-1 flex flex-col md:rounded-[2rem] md:bg-white/5 md:border md:border-white/10 overflow-hidden relative">
                     {!activeChat ? (
                       <div className="p-6 flex flex-col h-full animate-in fade-in duration-300">
                          
                          <div className="flex justify-between items-center mb-4">
                             <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Active Contexts</h3>
                             <button onClick={handleOpenSessionModal} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                                <Plus size={16} />
                             </button>
                          </div>

                          {activeProject.chats.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 overflow-y-auto custom-scrollbar">
                               {activeProject.chats.map((chat) => (
                                 <div key={chat.id} onClick={() => setActiveChat(chat)} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all flex justify-between items-center group relative overflow-hidden shrink-0">
                                    <div className="flex items-center gap-3 relative z-10">
                                       <MessageSquare size={18} className={`text-${activeProject.color}-300`} />
                                       <span className="font-medium text-white/90 text-lg">{chat.title}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 relative z-10">
                                       <ArrowUpRight size={18} className="text-white/20 group-hover:text-white/60" />
                                       <button 
                                         onClick={(e) => requestDeleteChat(e, chat.id)}
                                         className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-full text-white/30 hover:text-red-400 transition-all"
                                       >
                                          <Trash2 size={16} />
                                       </button>
                                    </div>

                                    <div className={`absolute inset-0 bg-${activeProject.color}-500/10 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                 </div>
                               ))}
                            </div>
                          ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-white/20">
                               <MessageSquare size={48} className="mb-4 opacity-50" />
                               <p>No active chats yet.</p>
                               <button 
                                 onClick={handleOpenSessionModal}
                                 className={`mt-4 px-6 py-2 rounded-full bg-${activeProject.color}-500/20 text-${activeProject.color}-300 hover:bg-${activeProject.color}-500/30 transition-colors border border-${activeProject.color}-500/20`}
                               >
                                 Start New Session
                               </button>
                            </div>
                          )}
                       </div>
                     ) : (
                       <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                             <div className="flex items-center gap-3">
                                <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft size={20} /></button>
                                <div><div className="font-medium">{activeChat.title}</div><div className="text-xs text-white/40">Last active {activeChat.lastEdited}</div></div>
                             </div>
                             <button className="p-2 hover:bg-white/10 rounded-full text-white/40"><MoreVertical size={20} /></button>
                          </div>
                          <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                              <div className="flex gap-4 max-w-2xl">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-${activeProject.color}-500 to-blue-500 flex items-center justify-center text-[10px] font-bold shadow-lg`}>AI</div>
                                <div className="p-4 rounded-2xl rounded-tl-none bg-white/5 border border-white/10 text-white/90 leading-relaxed">
                                   Here is the summary of <strong>{activeChat.title}</strong>: <br/>{activeChat.summary}. Would you like to continue?
                                </div>
                             </div>
                          </div>
                          <div className="p-4 bg-black/20">
                             <div className="flex gap-2 rounded-xl bg-white/5 border border-white/10 p-2 focus-within:border-white/20 transition-colors">
                                <input className="flex-1 bg-transparent border-none outline-none px-2 text-sm" placeholder="Type a message..." />
                                <button className={`p-2 rounded-lg bg-${activeProject.color}-500 text-black hover:opacity-90 transition-opacity`}><Send size={16} /></button>
                             </div>
                          </div>
                       </div>
                     )}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isModalOpen && (
            <CreateModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              onCreate={createProject} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSessionModalOpen && (
            <CreateSessionModal 
              isOpen={isSessionModalOpen} 
              onClose={() => setIsSessionModalOpen(false)} 
              onCreate={handleCreateSession} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {deleteTarget && (
            <DeleteModal 
              isOpen={!!deleteTarget} 
              onClose={() => setDeleteTarget(null)} 
              onConfirm={confirmDelete}
              title={`Delete ${deleteTarget.title}?`}
              description="This action cannot be undone."
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}