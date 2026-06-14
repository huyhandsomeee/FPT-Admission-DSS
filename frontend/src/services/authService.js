import api from '../config/axiosConfig';

const TOKEN_KEY = 'admission_token';
const USER_KEY = 'admission_user';

const authService = {
  async login(email, password) {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  },

  async register(email, password, fullName, phone) {
    const { data } = await api.post('/api/auth/register', { email, password, fullName, phone });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  },

  async getMe() {
    const { data } = await api.get('/api/auth/me');
    return data;
  },

  async validateToken() {
    try {
      const { data } = await api.post('/api/auth/validate');
      return data.valid;
    } catch {
      return false;
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try { return JSON.parse(userStr); } catch { return null; }
  },

  updateStoredUser(updates) {
    const current = this.getCurrentUser() || {};
    const updated = { ...current, ...updates };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    return updated;
  },

  clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async logout() {
    this.clearAuthData();
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

export default authService;
