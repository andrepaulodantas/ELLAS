import { useState, useCallback } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import { login, register, logout, getCurrentUser } from '../services/apiService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const user = await login(credentials);
      setUser(user);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const user = await register(data);
      setUser(user);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await logout();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}; 