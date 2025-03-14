// src/config/api.config.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  ENDPOINTS: {
    TASKS: '/v1/tasks',
  },
  TIMEOUT: 10000, // 10 seconds
};
