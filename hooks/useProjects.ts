import { useState, useEffect } from 'react';
import { Project, Task, ChatSession } from '../types';
import { getAllProjects, saveProject, deleteProject as dbDeleteProject, seedInitialData } from '../lib/db';

const INITIAL_DATA: Project[] = [
  { 
    id: '1', 
    title: 'Algorithms', 
    subtitle: 'Sorting & Graphs', 
    icon: 'cpu', 
    color: 'cyan', 
    status: 'Active',
    createdAt: new Date().toISOString(),
    context: 'User is focusing on Big O notation.',
    chats: [],
    tasks: [
      { id: 't1', text: 'Watch Week 3 Lecture', completed: true },
      { id: 't2', text: 'Implement QuickSort in Python', completed: true }
    ]
  }
];

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await seedInitialData(INITIAL_DATA);
      const storedProjects = await getAllProjects();
      setProjects(storedProjects.reverse());
      setLoading(false);
    };
    loadData();
  }, []);

  const updateProject = async (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    await saveProject(updatedProject);
  };

  const createProject = async (title: string, subtitle: string, color: string, icon: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title,
      subtitle,
      color,
      icon,
      status: 'Active',
      createdAt: new Date().toISOString(),
      context: 'New empty context ready for data.',
      chats: [],
      tasks: []
    };
    setProjects(prev => [newProject, ...prev]);
    await saveProject(newProject);
  };

  // --- DELETE PROJECT (The Big Red Button) ---
  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    await dbDeleteProject(id);
  };

  const addTask = async (projectId: string, text: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false
    };

    const updatedProject = { ...project, tasks: [...project.tasks, newTask] };
    await updateProject(updatedProject);
    return updatedProject;
  };

  // --- NEW: DELETE TASK ---
  const deleteTask = async (projectId: string, taskId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const updatedTasks = project.tasks.filter(t => t.id !== taskId);
    const updatedProject = { ...project, tasks: updatedTasks };
    
    await updateProject(updatedProject);
    return updatedProject;
  };

  const addChatSession = async (projectId: string, title: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const newChat: ChatSession = {
      id: crypto.randomUUID(),
      title: title || 'New Session',
      summary: 'No messages yet.',
      messages: [],
      lastEdited: new Date().toLocaleDateString()
    };

    const updatedProject = { ...project, chats: [newChat, ...project.chats] };
    await updateProject(updatedProject);
    return updatedProject;
  };

  // --- NEW: DELETE CHAT SESSION ---
  const deleteChatSession = async (projectId: string, chatId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedChats = project.chats.filter(c => c.id !== chatId);
    const updatedProject = { ...project, chats: updatedChats };
    
    await updateProject(updatedProject);
    return updatedProject;
  };

  return { 
    projects, 
    loading, 
    updateProject, 
    createProject, 
    deleteProject, 
    addTask, 
    deleteTask, 
    addChatSession, 
    deleteChatSession 
  };
}