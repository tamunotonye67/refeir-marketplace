/**
 * Refeir Pioneers Centralized Frontend Client API
 * Directs all frontend requests to the custom backend server via REST API.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  found?: boolean;
  [key: string]: any;
}

// Get active staff auth headers for privileged requests
function getStaffHeaders(): Record<string, string> {
  try {
    const session = sessionStorage.getItem('refeir_active_staff_session');
    if (session) {
      const parsed = JSON.parse(session);
      return {
        'x-staff-role': parsed.role || '',
        'x-staff-email': parsed.email || ''
      };
    }
  } catch {
    // ignore
  }
  return {};
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getStaffHeaders()
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    }
  };

  try {
    const response = await fetch(url, config);
    const result = await response.json().catch(() => ({
      success: response.ok,
      error: response.statusText || 'Invalid JSON response from server'
    }));

    if (!response.ok && !result.error) {
      result.error = `HTTP Error ${response.status}: ${response.statusText}`;
    }

    return result;
  } catch (error: any) {
    console.warn(`[API Network Warning] ${endpoint}:`, error.message);
    return {
      success: false,
      error: error.message || 'Network error connecting to backend API.'
    };
  }
}

export const api = {
  // ── Applications ──
  applications: {
    getAll: () => request('/api/applications'),
    lookup: (query: string) => request(`/api/applications/lookup?q=${encodeURIComponent(query)}`),
    submit: (data: any) => request('/api/applications', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, data: any) => request(`/api/applications/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
    delete: (id: string) => request(`/api/applications/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },

  // ── Contributor Auth & Profile ──
  auth: {
    signup: (data: any) => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
    signin: (email: string, password: string) => request('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
    getContributors: () => request('/api/auth/contributors'),
    updateProfile: (data: any) => request('/api/auth/profile', { method: 'PATCH', body: JSON.stringify(data) }),
    suspend: (email: string, reason?: string) => request('/api/auth/suspend', {
      method: 'PATCH',
      body: JSON.stringify({ email, reason })
    }),
    activate: (email: string) => request('/api/auth/activate', {
      method: 'PATCH',
      body: JSON.stringify({ email })
    })
  },

  // ── Staff & Admin Directory ──
  staff: {
    login: (credentials: { email?: string; password?: string; passcode?: string }) =>
      request('/api/staff/login', { method: 'POST', body: JSON.stringify(credentials) }),
    getAll: () => request('/api/staff'),
    add: (data: any) => request('/api/staff', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/api/staff/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
    delete: (id: string) => request(`/api/staff/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },

  // ── Squad Missions & Tasks ──
  tasks: {
    getAll: (division?: string) => request(`/api/tasks${division ? `?division=${encodeURIComponent(division)}` : ''}`),
    create: (data: any) => request('/api/tasks', { method: 'POST', body: JSON.stringify(data) }),
    toggle: (id: string) => request(`/api/tasks/${encodeURIComponent(id)}/toggle`, { method: 'PATCH' }),
    delete: (id: string) => request(`/api/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },

  // ── Deliverables & Proof of Work ──
  proofs: {
    getAll: (email?: string) => request(`/api/proofs${email ? `?email=${encodeURIComponent(email)}` : ''}`),
    submit: (data: any) => request('/api/proofs', { method: 'POST', body: JSON.stringify(data) }),
    review: (refId: string, data: any) => request(`/api/proofs/${encodeURIComponent(refId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  },

  // ── Certificates ──
  certificates: {
    getAll: (params?: { email?: string; certNumber?: string }) => {
      const q = new URLSearchParams();
      if (params?.email) q.set('email', params.email);
      if (params?.certNumber) q.set('certNumber', params.certNumber);
      return request(`/api/certificates${q.toString() ? `?${q.toString()}` : ''}`);
    },
    issue: (data: any) => request('/api/certificates', { method: 'POST', body: JSON.stringify(data) }),
    revoke: (id: string) => request(`/api/certificates/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },

  // ── Protocol Governance & Health ──
  governance: {
    runInactivityCheck: () => request('/api/governance/inactivity-check', { method: 'POST' }),
    health: () => request('/api/health')
  }
};
