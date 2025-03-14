// src/services/TaskService.ts
import { Task } from '../models/Task';
import { TaskAPI } from '../api/taskApi';

interface TaskListParams {
  page?: number;
  limit?: number;
  status?: 'all' | 'active' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  labels?: number[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  search?: string;
  sortBy?: 'dueDate' | 'priority' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const TaskService = {
  listTasks: async (params?: TaskListParams) => {
    try {
      const response = await TaskAPI.listTasks(params);
      return response.tasks || [];
    } catch (error) {
      console.error('Error listing tasks:', error);
      throw error;
    }
  },

  getTask: async (id: number): Promise<Task | undefined> => {
    try {
      const response = await TaskAPI.getTask(id);
      return response.task;
    } catch (error) {
      console.error(`Error getting task ${id}:`, error);
      return undefined;
    }
  },

  addTask: async (
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Task | undefined> => {
    try {
      const response = await TaskAPI.addTask(task);
      return response.task;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error; // Rethrow so UI can handle the error
    }
  },

  updateTask: async (id: number, task: Partial<Task>): Promise<Task | undefined> => {
    try {
      const response = await TaskAPI.updateTask(id, task);
      return response.task;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },

  batchUpdateTasks: async (
    updates: Array<{ id: number; task: Partial<Task> }>
  ): Promise<Task[]> => {
    try {
      const response = await TaskAPI.batchUpdateTasks(updates);
      return response.tasks;
    } catch (error) {
      console.error('Error batch updating tasks:', error);
      throw error;
    }
  },

  toggleComplete: async (id: number): Promise<Task | undefined> => {
    try {
      const response = await TaskAPI.toggleComplete(id);
      return response.task;
    } catch (error) {
      console.error(`Error toggling completion of task ${id}:`, error);
      throw error;
    }
  },

  deleteTask: async (id: number): Promise<boolean> => {
    try {
      const response = await TaskAPI.deleteTask(id);
      return response.success;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  },

  getTasksByLabel: async (labelId: number): Promise<Task[]> => {
    try {
      const response = await TaskAPI.getTasksByLabel(labelId);
      return response.tasks;
    } catch (error) {
      console.error(`Error getting tasks by label ${labelId}:`, error);
      return [];
    }
  },
};
