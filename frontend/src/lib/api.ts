import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Auth
export const authApi = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

// Decisions
export const decisionsApi = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/decisions?page=${page}&limit=${limit}`),
  getOne: (id: string) =>
    api.get(`/decisions/${id}`),
  create: (title: string) =>
    api.post('/decisions', { title }),
  update: (id: string, title: string) =>
    api.patch(`/decisions/${id}`, { title }),
  delete: (id: string) =>
    api.delete(`/decisions/${id}`),
  evaluate: (id: string) =>
    api.get(`/decisions/${id}/evaluate`),
};

// Options
export const optionsApi = {
  create: (decisionId: string, name: string) =>
    api.post(`/decisions/${decisionId}/options`, { name }),
  update: (decisionId: string, optionId: string, name: string) =>
    api.patch(`/decisions/${decisionId}/options/${optionId}`, { name }),
  delete: (decisionId: string, optionId: string) =>
    api.delete(`/decisions/${decisionId}/options/${optionId}`),
};

// Criteria
export const criteriaApi = {
  create: (decisionId: string, name: string, weight: number) =>
    api.post(`/decisions/${decisionId}/criteria`, { name, weight }),
  update: (decisionId: string, criterionId: string, data: { name?: string; weight?: number }) =>
    api.patch(`/decisions/${decisionId}/criteria/${criterionId}`, data),
  delete: (decisionId: string, criterionId: string) =>
    api.delete(`/decisions/${decisionId}/criteria/${criterionId}`),
};

// Scores
export const scoresApi = {
  create: (decisionId: string, optionId: string, criterionId: string, value: number) =>
    api.post(`/decisions/${decisionId}/scores`, { optionId, criterionId, value }),
  update: (decisionId: string, scoreId: string, value: number) =>
    api.patch(`/decisions/${decisionId}/scores/${scoreId}`, { value }),
};

export default api;
