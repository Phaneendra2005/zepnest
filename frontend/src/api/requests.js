import api from './axios';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
};

// ─── Service Requests ─────────────────────────────────────────────────────────
export const requestsApi = {
  list: (params) => api.get('/requests', { params }),

  get: (id) => api.get(`/requests/${id}`),

  create: (formData) =>
    api.post('/requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateStatus: (id, status) =>
    api.patch(`/requests/${id}/status`, { status }),

  delete: (id) => api.delete(`/requests/${id}`),
};
