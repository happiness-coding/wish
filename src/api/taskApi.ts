// src/api/taskApi.ts
import { Task } from '../models/Task';
import { API_CONFIG } from '../config/api.config';
import { get, post, patch, del } from './apiClient';

// Response types
interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}

interface TaskResponse {
  task: Task;
}

interface BatchUpdateResponse {
  tasks: Task[];
  updatedCount: number;
}

// Query parameter types
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
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Export the TaskAPI service
export const TaskAPI = {
  // Get all tasks (with filtering)
  listTasks: (params?: TaskListParams): Promise<TaskListResponse> => {
    return get<TaskListResponse>(API_CONFIG.ENDPOINTS.TASKS, { params });
  },

  // Get a specific task by ID
  getTask: (id: number): Promise<TaskResponse> => {
    return get<TaskResponse>(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`);
  },

  // Create a new task
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskResponse> => {
    return post<TaskResponse>(API_CONFIG.ENDPOINTS.TASKS, task);
  },

  // Update a task (partial update)
  updateTask: (id: number, task: Partial<Task>): Promise<TaskResponse> => {
    return patch<TaskResponse>(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`, task);
  },

  // Batch update multiple tasks
  batchUpdateTasks: (
    updates: Array<{ id: number; task: Partial<Task> }>
  ): Promise<BatchUpdateResponse> => {
    return patch<BatchUpdateResponse>(`${API_CONFIG.ENDPOINTS.TASKS}/batch`, { updates });
  },

  // Toggle task completion status
  toggleComplete: (id: number): Promise<TaskResponse> => {
    return patch<TaskResponse>(`${API_CONFIG.ENDPOINTS.TASKS}/${id}/toggle-complete`);
  },

  // Delete a task
  deleteTask: (id: number): Promise<{ success: boolean }> => {
    return del<{ success: boolean }>(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`);
  },

  // Get tasks by label
  getTasksByLabel: (labelId: number): Promise<TaskListResponse> => {
    return get<TaskListResponse>(API_CONFIG.ENDPOINTS.TASKS, {
      params: { labels: [labelId] },
    });
  },
};
