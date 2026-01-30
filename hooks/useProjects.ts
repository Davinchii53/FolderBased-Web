import { useState, useEffect } from 'react';
import { Project, Task, ChatSession } from '../types';
// Removed 'seedInitialData' from import
import { getAllProjects, saveProject, deleteProject as dbDeleteProject } from '../lib/db';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // REMOVED: await seedInitialData(INITIAL_DATA);
      
      const storedProjects = await getAllProjects();
      // Sort: Newest first
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