const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper for authorized headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('root_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const freshFetch = async (url, options = {}) => {
  return fetch(url, {
    cache: 'no-store',
    ...options,
    headers: {
      ...(options.headers || {})
    }
  });
};

export const api = {
  baseUrl: API_BASE_URL,

  // ==================== 1. PROJECTS API ====================
  async getProjects() {
    try {
      const res = await freshFetch(`${API_BASE_URL}/projects`);
      const data = await res.json();
      if (data.success) return data.data;
      return [];
    } catch (err) {
      console.warn('Backend unavailable, using fallback projects:', err.message);
      return null;
    }
  },

  async createProject(projectData) {
    const res = await freshFetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData)
    });
    return res.json();
  },

  async updateProject(id, projectData) {
    const res = await freshFetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData)
    });
    return res.json();
  },

  async deleteProject(id) {
    const res = await freshFetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // ==================== 2. GITHUB REPO & OAUTH API ====================
  async getRepoTree(repo, branch = '') {
    try {
      const token = localStorage.getItem('github_user_token') || '';
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await freshFetch(`${API_BASE_URL}/github/repo-tree?repo=${encodeURIComponent(repo)}${branch ? `&branch=${branch}` : ''}`, { headers });
      return res.json();
    } catch (err) {
      console.warn('GitHub tree fetch error:', err.message);
      return { success: false, message: err.message };
    }
  },

  async getFileContent(repo, path, branch = '') {
    try {
      const token = localStorage.getItem('github_user_token') || '';
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await freshFetch(`${API_BASE_URL}/github/file-content?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(path)}${branch ? `&branch=${branch}` : ''}`, { headers });
      return res.json();
    } catch (err) {
      console.warn('GitHub file content error:', err.message);
      return { success: false, message: err.message };
    }
  },

  async getGitHubAuthUrl() {
    const res = await freshFetch(`${API_BASE_URL}/github/auth-url`);
    return res.json();
  },

  async handleGitHubCallback(code) {
    const res = await freshFetch(`${API_BASE_URL}/github/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    return res.json();
  },

  // ==================== 3. GOOGLE ANALYTICS 4 & SEARCH CONSOLE ====================
  async trackEvent(eventType, page, metadata = {}) {
    try {
      let sessionId = sessionStorage.getItem('root_session_id');
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('root_session_id', sessionId);
      }

      await freshFetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          page: page || window.location.pathname + window.location.hash,
          referrer: document.referrer || 'Direct',
          sessionId,
          metadata
        })
      });
    } catch (e) {
      // Telemetry should never disrupt user UI
    }
  },

  async getAnalyticsOverview(range = '30d') {
    try {
      const res = await freshFetch(`${API_BASE_URL}/analytics/overview?range=${range}`, {
        headers: getAuthHeaders()
      });
      return res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async getRealtimeAnalytics() {
    try {
      const res = await freshFetch(`${API_BASE_URL}/analytics/realtime`, {
        headers: getAuthHeaders()
      });
      return res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async getAcquisitionAnalytics() {
    try {
      const res = await freshFetch(`${API_BASE_URL}/analytics/acquisition`, {
        headers: getAuthHeaders()
      });
      return res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async getPagesAnalytics() {
    try {
      const res = await freshFetch(`${API_BASE_URL}/analytics/pages`, {
        headers: getAuthHeaders()
      });
      return res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async getSearchConsoleData() {
    try {
      const res = await freshFetch(`${API_BASE_URL}/analytics/search-console`, {
        headers: getAuthHeaders()
      });
      return res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async getGeoAnalytics() {
    try {
      const res = await freshFetch(`${API_BASE_URL}/analytics/geo`, {
        headers: getAuthHeaders()
      });
      return res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async getDevicesAnalytics() {
    try {
      const res = await freshFetch(`${API_BASE_URL}/analytics/devices`, {
        headers: getAuthHeaders()
      });
      return res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async getAnalyticsConfig() {
    try {
      const res = await freshFetch(`${API_BASE_URL}/analytics/config`, {
        headers: getAuthHeaders()
      });
      return res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async updateAnalyticsConfig(configPayload) {
    const res = await freshFetch(`${API_BASE_URL}/analytics/config`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(configPayload)
    });
    return res.json();
  },

  // ==================== 4. ACTIVITIES API ====================
  async getActivities() {
    try {
      const res = await freshFetch(`${API_BASE_URL}/activities`);
      const data = await res.json();
      if (data.success) return data.data;
      return [];
    } catch (err) {
      console.warn('Backend unavailable, using fallback activities:', err.message);
      return null;
    }
  },

  async createActivity(activityData) {
    const res = await freshFetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(activityData)
    });
    return res.json();
  },

  async updateActivity(id, activityData) {
    const res = await freshFetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(activityData)
    });
    return res.json();
  },

  async deleteActivity(id) {
    const res = await freshFetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // ==================== 5. TIMELINE API ====================
  async getTimeline() {
    try {
      const res = await freshFetch(`${API_BASE_URL}/timeline`);
      const data = await res.json();
      if (data.success) return data.data;
      return [];
    } catch (err) {
      console.warn('Backend unavailable, using fallback timeline:', err.message);
      return null;
    }
  },

  async createTimelineMilestone(milestone) {
    const res = await freshFetch(`${API_BASE_URL}/timeline`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(milestone)
    });
    return res.json();
  },

  async updateTimelineMilestone(id, milestone) {
    const res = await freshFetch(`${API_BASE_URL}/timeline/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(milestone)
    });
    return res.json();
  },

  async deleteTimelineMilestone(id) {
    const res = await freshFetch(`${API_BASE_URL}/timeline/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // ==================== 6. ARTICLES API ====================
  async getArticles() {
    try {
      const res = await freshFetch(`${API_BASE_URL}/articles`);
      const data = await res.json();
      if (data.success) return data.data;
      return [];
    } catch (err) {
      console.warn('Backend unavailable, using fallback articles:', err.message);
      return null;
    }
  },

  async createArticle(article) {
    const res = await freshFetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(article)
    });
    return res.json();
  },

  async updateArticle(id, article) {
    const res = await freshFetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(article)
    });
    return res.json();
  },

  async deleteArticle(id) {
    const res = await freshFetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // ==================== 7. PRODUCTS API ====================
  async getProducts() {
    try {
      const res = await freshFetch(`${API_BASE_URL}/products`);
      const data = await res.json();
      if (data.success) return data.data;
      return [];
    } catch (err) {
      console.warn('Backend unavailable, using fallback products:', err.message);
      return null;
    }
  },

  async updateProduct(id, productData) {
    const res = await freshFetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  // ==================== 8. CONTACT API ====================
  async sendContactMessage(payload) {
    const res = await freshFetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getContactMessages() {
    const res = await freshFetch(`${API_BASE_URL}/contact/messages`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async toggleMessageRead(id, read) {
    const res = await freshFetch(`${API_BASE_URL}/contact/messages/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ read })
    });
    return res.json();
  },

  async deleteContactMessage(id) {
    const res = await freshFetch(`${API_BASE_URL}/contact/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // ==================== 9. AUTH API ====================
  async login(username, password) {
    const res = await freshFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  async verifyToken() {
    const res = await freshFetch(`${API_BASE_URL}/auth/verify`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async updatePassword(payload) {
    const res = await freshFetch(`${API_BASE_URL}/auth/update-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // ==================== 10. IMAGE UPLOAD API ====================
  async uploadSingleImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('root_admin_token');

    const res = await fetch(`${API_BASE_URL}/upload/single`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    });
    return res.json();
  },

  async uploadMultipleImages(files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    const token = localStorage.getItem('root_admin_token');

    const res = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    });
    return res.json();
  }
};

export default api;
