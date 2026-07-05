const API_URL = import.meta.env.VITE_API_URL || '';

// Helper to check if API is enabled
export const isApiEnabled = () => !!API_URL;

// Helper to construct headers
const getHeaders = (userId = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Try to get userId from state or storage if not provided
  let activeUserId = userId;
  if (!activeUserId) {
    try {
      const stored = localStorage.getItem('nutriberg_user');
      if (stored) {
        activeUserId = JSON.parse(stored).id;
      }
    } catch (e) {}
  }

  if (activeUserId) {
    headers['Authorization'] = `Bearer ${activeUserId}`;
    headers['x-user-id'] = activeUserId;
  }
  return headers;
};

// API Services
export const api = {
  // Recipes
  async getRecipes(params = {}) {
    if (!isApiEnabled()) return null;
    const query = new URLSearchParams();
    if (params.cuisine && params.cuisine !== 'All') query.append('cuisine', params.cuisine);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    
    const res = await fetch(`${API_URL}/recipes?${query.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch recipes');
    const data = await res.json();
    return data.recipes;
  },

  async getRecipeById(id) {
    if (!isApiEnabled()) return null;
    const res = await fetch(`${API_URL}/recipes/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch recipe');
    return await res.json();
  },

  async createRecipe(recipe) {
    if (!isApiEnabled()) return null;
    const res = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(recipe),
    });
    if (!res.ok) throw new Error('Failed to create recipe');
    return await res.json();
  },

  async rateRecipe(recipeId, rating) {
    if (!isApiEnabled()) return null;
    const res = await fetch(`${API_URL}/recipes/${recipeId}/rate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ rating }),
    });
    if (!res.ok) throw new Error('Failed to rate recipe');
    return await res.json();
  },

  // User Profile
  async getUserProfile(userId) {
    if (!isApiEnabled()) return null;
    const res = await fetch(`${API_URL}/users/profile`, {
      headers: getHeaders(userId),
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return await res.json();
  },

  async updateUserProfile(userId, profileUpdates) {
    if (!isApiEnabled()) return null;
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(userId),
      body: JSON.stringify(profileUpdates),
    });
    if (!res.ok) throw new Error('Failed to update user profile');
    return await res.json();
  },

  // Meal Logs
  async getMealLogs(startDate, endDate) {
    if (!isApiEnabled()) return null;
    const query = new URLSearchParams();
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);
    
    const res = await fetch(`${API_URL}/meals?${query.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch meal logs');
    return await res.json();
  },

  async logMeal(date, mealType, recipeId, servings = 1, customMeal = null) {
    if (!isApiEnabled()) return null;
    const res = await fetch(`${API_URL}/meals`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ date, mealType, recipeId, servings, customMeal }),
    });
    if (!res.ok) throw new Error('Failed to log meal');
    return await res.json();
  },

  // Meal Plans
  async getMealPlan(weekId) {
    if (!isApiEnabled()) return null;
    const res = await fetch(`${API_URL}/meal-plans/${weekId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch meal plan');
    const data = await res.json();
    return data.meals || {};
  },

  async saveMealPlan(weekId, meals) {
    if (!isApiEnabled()) return null;
    const res = await fetch(`${API_URL}/meal-plans`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ weekId, meals }),
    });
    if (!res.ok) throw new Error('Failed to save meal plan');
    return await res.json();
  },
};
