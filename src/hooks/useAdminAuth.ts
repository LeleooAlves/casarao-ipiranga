import { useState, useEffect } from 'react';

const ADMIN_AUTH_KEY = 'casarao_admin_auth';

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verificar se há autenticação salva no localStorage
    const savedAuth = localStorage.getItem(ADMIN_AUTH_KEY);
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === 'casaraoadmin' && password === 'casaraosenha') {
      setIsAuthenticated(true);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(ADMIN_AUTH_KEY);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};
