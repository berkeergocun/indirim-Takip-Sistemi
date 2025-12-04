export const useAuth = () => {
  const user = useState('user', () => null as any);
  const token = useState('token', () => '');
  const isAuthenticated = computed(() => !!token.value);

  const login = async (email: string, password: string) => {
    try {
      const response: any = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      token.value = response.data.token;
      user.value = response.data.user;
      
      if (process.client) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.data?.message || 'Giriş başarısız' };
    }
  };

  const register = async (data: { email: string; password: string; name: string; phone?: string }) => {
    try {
      const response: any = await $fetch('/api/auth/register', {
        method: 'POST',
        body: data,
      });

      token.value = response.data.token;
      user.value = response.data.user;
      
      if (process.client) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.data?.message || 'Kayıt başarısız' };
    }
  };

  const logout = () => {
    token.value = '';
    user.value = null;
    
    if (process.client) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    navigateTo('/login');
  };

  const fetchUser = async () => {
    if (!token.value) return;

    try {
      const response: any = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      user.value = response.data.user;
    } catch (error) {
      logout();
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const response: any = await $fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: data,
      });

      user.value = response.data.user;
      
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.data?.message || 'Güncelleme başarısız' };
    }
  };

  // Initialize from localStorage on client
  if (process.client) {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(savedUser);
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
  };
};
