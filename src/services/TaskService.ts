// src/services/TaskService.ts (replacing BlogService.ts)
import { Task } from '../models/Task';

// In a real app, this would connect to a backend
let tasks: Task[] = [
  {
    id: 1,
    title: "Set up project structure",
    description: "Create folder structure and configure initial dependencies",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
    priority: "high",
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const TaskService = {
  listTasks: (): Task[] => {
    return [...tasks];
  },

  getTask: (id: number): Task | undefined => {
    return tasks.find(task => task.id === id);
  },

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    const newTask = {
      ...task,
      id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    tasks.push(newTask);
    return newTask;
  },

  updateTask: (id: number, updatedTask: Partial<Task>): Task | undefined => {
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        ...updatedTask,
        updatedAt: new Date()
      };
      return tasks[index];
    }
    return undefined;
  },

  toggleComplete: (id: number): Task | undefined => {
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        isCompleted: !tasks[index].isCompleted,
        updatedAt: new Date()
      };
      return tasks[index];
    }
    return undefined;
  },

  deleteTask: (id: number): boolean => {
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    return tasks.length < initialLength;
  }
};