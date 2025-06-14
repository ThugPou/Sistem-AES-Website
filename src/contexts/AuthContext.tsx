//AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, fetchUserProfile, registerUser } from '../api';

interface AuthContextType {
    token: string | null;
    user: {
        id: number;
        username: string;
        role_id: number;
    } | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string, role_id: number) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (token && !user) {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            } else {
                const getUser = async () => {
                    const user = await fetchUserProfile(token);
                    setUser(user);
                    localStorage.setItem('user', JSON.stringify(user));
                };
            getUser();
            }
        }
    }, [token]);


    const login = async (username: string, password: string) => {
        try {
            const response = await loginUser({ username, password });
            if (response?.access_token) {
                setToken(response.access_token);
                localStorage.setItem('token', response.access_token);
                const userProfile = await fetchUserProfile(response.access_token);
                setUser(userProfile);
                localStorage.setItem('user', JSON.stringify(userProfile));
                navigate('/dashboard');
            }
        } catch (error: any) {
        if (error.response && error.response.status === 401) {
          throw new Error(error.response.data.detail || "Gagal Login.");
        }
        throw new Error("Terjadi kesalahan saat login.");
      }
    };

    const register = async (username: string, password: string, role_id: number) => {
      try {
        await registerUser({ username, password, role_id });
        navigate('/');
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          throw new Error(error.response.data.detail || "Gagal mendaftar.");
        }
        throw new Error("Terjadi kesalahan saat mendaftar.");
      }
    };


    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ token, user, login, register, logout, }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
export type { AuthContextType };
