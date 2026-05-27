const API_BASE = "http://localhost:4000";

export const API_BASE_URL = API_BASE;

const getToken = () => localStorage.getItem('access_token');

type RequestOptions = RequestInit & {
    headers?: HeadersInit;
};

const request = async <T>(path: string, options: RequestOptions = {}) => {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    const token = getToken();
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Request failed');
    }

    return data as T;
};

export const authAPI = {
    login: async (email: string, password: string) => {
        return request('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    register: async (name: string, email: string, password: string) => {
        return request('/users/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
    },

    logout: async () => {
        return request('/users/logout', {
            method: 'POST'
        });
    }
};

export const tweetAPI = {
    create: async (content: string) => {
        return request('/tweets', {
            method: 'POST',
            body: JSON.stringify({ content })
        });
    },

    like: async (id: string) => {
        return request(`/tweets/${id}/like`, {
            method: 'PATCH'
        });
    },

    timeline: async () => {
        return request('/tweets', {
            method: 'GET'
        });
    }
};

export const userAPI = {
    getAllUsers: async () => {
        return request('/users', {
            method: 'GET'
        });
    },

    updateProfile: async (id: string, updateData: Record<string, unknown>) => {
        return request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });
    }
};

export const authStorage = {
    setToken: (token: string) => localStorage.setItem('access_token', token),
    getToken,
    clearToken: () => localStorage.removeItem('access_token')
};