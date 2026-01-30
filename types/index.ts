// types/index.ts

// 1. The Checkbox Logic (For Progress)
export interface Task {
  id: string;
  text: string;       // e.g. "Research Database Schema"
  completed: boolean; // true = checked, false = empty
}

// 2. The Chat Logic (Specific Conversations)
export interface ChatSession {
  id: string;
  title: string;      // e.g. "Debugging Session 1"
  summary: string;    // Short AI summary of this specific chat
  messages: any[];    // We'll define the message structure later
  lastEdited: string; // ISO Date string
}

// 3. The Project Logic (The Glass Card)
export interface Project {
  id: string;
  title: string;      // e.g. "Algorithm Design"
  subtitle: string;   // e.g. "Sorting & Graphs"
  
  // Visuals
  icon: string;       // Name of the Lucide icon
  color: string;      // "cyan", "purple", "green"
  
  // The "Brains"
  context: string;    // SHARED MEMORY: All chats in this project can see this!
  
  // The Content
  tasks: Task[];          // Progress is calculated from this: (completed / total) * 100
  chats: ChatSession[];   // List of all conversations in this folder
  
  // Meta
  status: 'Active' | 'Paused' | 'Archived';
  createdAt: string;
}