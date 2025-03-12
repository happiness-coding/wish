// src/models/Task.ts
export interface Label {
  id: number;
  name: string;
  color: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  labels: Label[];
  createdAt: Date;
  updatedAt: Date;
}