// src/models/Task.ts (replacing BlogPost.ts)
export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}