import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import type { User, AuthResponse } from '@/lib/types';

const getValidCredentials = (): Map<string, string> => {
  const credentialsStr =
    process.env.NEXT_PUBLIC_VALID_CREDENTIALS || 'admin:admin123,manager:manager123';
  const map = new Map<string, string>();

  credentialsStr.split(',').forEach((pair) => {
    const [username, password] = pair.split(':');
    if (username && password) {
      map.set(username.trim(), password.trim());
    }
  });

  return map;
};

const VALID_CREDENTIALS = getValidCredentials();

interface UseAuthReturn {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        const validPassword = VALID_CREDENTIALS.get(username);

        if (!validPassword || password !== validPassword) {
          setError('Invalid username or password');
          setLoading(false);
          return;
        }

        const role = username === 'admin' ? 'admin' : 'manager';

        const response = await apiClient.post<AuthResponse>('/api/auth/login', {
          username,
          password,
        });

        const token = response.data.token;

        if (!token) {
          throw new Error('No token returned from server');
        }

        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify({ username, role, id: '' }));

        setUser({ username, role, id: '', name: username });

        router.push('/dashboard');
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Login failed. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  }, [router]);

  const getCurrentUser = useCallback((): User | null => {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  };

  return {
    login,
    logout,
    loading,
    error,
    user: user || getCurrentUser(),
    isAuthenticated: isAuthenticated(),
  };
};
