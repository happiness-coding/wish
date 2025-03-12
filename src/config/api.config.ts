// src/config/api.config.ts
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://api.taskmanager.com',
  ENDPOINTS: {
    TASKS: '/tasks',
  },
  TIMEOUT: 10000, // 10 seconds
};
