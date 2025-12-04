export type Theme = 'light' | 'dark';

export const useTheme = () => {
  const theme = useState<Theme>('theme', () => 'light');
  const { user, updateProfile } = useAuth();

  const setTheme = async (newTheme: Theme) => {
    theme.value = newTheme;

    if (process.client) {
      localStorage.setItem('theme', newTheme);
      
      // Update HTML class
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Update user preference in database
    if (user.value) {
      await updateProfile({ ...user.value, theme: newTheme });
    }
  };

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light');
  };

  // Initialize theme
  if (process.client) {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const userTheme = user.value?.theme as Theme;
    const initialTheme = savedTheme || userTheme || 'light';
    
    theme.value = initialTheme;
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }

  return {
    theme,
    setTheme,
    toggleTheme,
  };
};
