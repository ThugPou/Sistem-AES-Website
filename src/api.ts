//api.ts

import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

interface LoginCredentials {
    username: string;
    password: string;
}

interface RegisterData {
    username: string;
    password: string;
    role_id: number;
}

interface UserProfile {
    username: string;
}

const loginUser = async (credentials: LoginCredentials): Promise<{ access_token: string }> => {
    try {
        const params = new URLSearchParams();
        Object.entries(credentials).forEach(([key, value]) => {
            params.append(key, value);
        });

        const response = await axios.post(`${API_URL}/auth/token`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

const registerUser = async (userData: RegisterData): Promise<void> => {
    try {
        await axios.post(`${API_URL}/auth/register`, userData);
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

const fetchUserProfile = async (token: string): Promise<UserProfile> => {
    try {
        const response = await axios.get(`${API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Fetch user profile error:', error);
        throw error;
    }
};


export { loginUser, registerUser, fetchUserProfile };