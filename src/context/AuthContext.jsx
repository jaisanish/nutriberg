import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, isApiEnabled } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'nutriberg_user';
const USERS_STORAGE_KEY = 'nutriberg_users';

// Mock user data
const defaultUser = {
  dietaryGoals: {
    calories: 2000,
    protein: 120,
    carbs: 250,
    fat: 65,
  },
  restrictions: [],
  preferences: [],
  streak: 0,
  recipesCooked: 0,
  favoriteRecipes: [],
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize generic mock users if none exist
  useEffect(() => {
    const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!existingUsers) {
      const defaultUsers = [
        {
          ...defaultUser,
          id: 'u1',
          name: 'Demo User',
          email: 'demo@nutriberg.com',
          password: 'password123',
          avatar: 'D',
          joinedDate: '2024-01-01',
          streak: 12,
          recipesCooked: 47,
          favoriteRecipes: ['1', '4', '8'],
        }
      ];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  }, []);

  useEffect(() => {
    const initSession = async () => {
      // Check for stored session
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setIsAuthenticated(true);
          
          if (isApiEnabled()) {
            const profile = await api.getUserProfile(parsed.id);
            if (profile) {
              setUser(profile);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
            }
          }
        } catch (e) {
          console.error("Error initializing user session from API:", e);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };
    initSession();
  }, []);

  const login = async (email, password) => {
    if (!email || !password) return { success: false, error: 'Please enter email and password' };

    const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const foundUser = storedUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      // Exclude password from session context
      const { password: _, ...sessionUser } = foundUser;
      
      let userToSet = sessionUser;
      if (isApiEnabled()) {
        try {
          const profile = await api.getUserProfile(sessionUser.id);
          if (profile) userToSet = profile;
        } catch (e) {
          console.error("Error syncing profile on login:", e);
        }
      }

      setUser(userToSet);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userToSet));
      navigate('/');
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = async (name, email, password) => {
    if (!name || !email || !password) return { success: false, error: 'Please fill in all fields' };

    const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    
    // Check if email exists
    if (storedUsers.some(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = {
      ...defaultUser,
      id: 'u_' + Date.now(),
      name,
      email,
      password, // In a real app, hash this!
      avatar: name.charAt(0).toUpperCase(),
      joinedDate: new Date().toISOString().split('T')[0],
      isNewUser: true
    };

    // Save to users list
    storedUsers.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));

    // Clear previous meal plans and logs so this new user starts completely fresh
    localStorage.removeItem('nutriberg_meal_log');
    localStorage.removeItem('nutriberg_meal_plan');

    // Log them in
    const { password: _, ...sessionUser } = newUser;

    if (isApiEnabled()) {
      try {
        await api.updateUserProfile(sessionUser.id, sessionUser);
      } catch (e) {
        console.error("Error syncing profile on signup:", e);
      }
    }

    setUser(sessionUser);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    
    navigate('/');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
    navigate('/auth');
  };

  const updateProfile = async (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (isApiEnabled()) {
      try {
        await api.updateUserProfile(user.id, updates);
      } catch (e) {
        console.error("Error updating user profile on server:", e);
      }
    }

    // Also update in users database
    const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    const userIndex = storedUsers.findIndex(u => u.id === updated.id);
    if (userIndex !== -1) {
      storedUsers[userIndex] = { ...storedUsers[userIndex], ...updates };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(storedUsers));
    }
  };

  const toggleFavorite = (recipeId) => {
    const favorites = user.favoriteRecipes || [];
    const updated = favorites.includes(recipeId)
      ? favorites.filter(id => id !== recipeId)
      : [...favorites, recipeId];
    updateProfile({ favoriteRecipes: updated });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      signup,
      logout,
      updateProfile,
      toggleFavorite,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
