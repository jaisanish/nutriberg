import { createContext, useContext, useState, useEffect } from 'react';
import { recipes, getRecipeById, sampleMealPlan } from '../data/recipes';
import { useAuth } from './AuthContext';
import { api, isApiEnabled } from '../services/api';

const MealContext = createContext(null);

const MEAL_LOG_KEY = 'nutriberg_meal_log';
const MEAL_PLAN_KEY = 'nutriberg_meal_plan';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

export function MealProvider({ children }) {
  const { user } = useAuth();

  const [mealPlan, setMealPlan] = useState(() => {
    const stored = localStorage.getItem(MEAL_PLAN_KEY);
    return stored ? JSON.parse(stored) : (user?.id === 'u1' ? sampleMealPlan : {});
  });

  const [mealLog, setMealLog] = useState(() => {
    const stored = localStorage.getItem(MEAL_LOG_KEY);
    return stored ? JSON.parse(stored) : (user?.id === 'u1' ? generateSampleLog() : []);
  });

  useEffect(() => {
    const loadMealData = async () => {
      if (isApiEnabled() && user?.id) {
        try {
          const logs = await api.getMealLogs();
          if (logs) setMealLog(logs);
          
          // Get current weekId dynamically
          const today = new Date();
          const target = new Date(today.valueOf());
          const dayNr = (today.getDay() + 6) % 7;
          target.setDate(target.getDate() - dayNr + 3);
          const firstThursday = target.valueOf();
          target.setMonth(0, 1);
          if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
          }
          const weekId = today.getFullYear() + '-W' + (1 + Math.ceil((firstThursday - target) / 604800000));
          
          const plan = await api.getMealPlan(weekId);
          if (plan) {
            setMealPlan(prev => ({ ...prev, [weekId]: plan }));
          }
        } catch (e) {
          console.error("Error loading meal data from API:", e);
        }
      } else {
        const storedPlan = localStorage.getItem(MEAL_PLAN_KEY);
        setMealPlan(storedPlan ? JSON.parse(storedPlan) : (user?.id === 'u1' ? sampleMealPlan : {}));
        
        const storedLog = localStorage.getItem(MEAL_LOG_KEY);
        setMealLog(storedLog ? JSON.parse(storedLog) : (user?.id === 'u1' ? generateSampleLog() : []));
      }
    };
    loadMealData();
  }, [user?.id]);

  useEffect(() => {
    localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(mealPlan));
  }, [mealPlan]);

  useEffect(() => {
    localStorage.setItem(MEAL_LOG_KEY, JSON.stringify(mealLog));
  }, [mealLog]);

  // Assign recipe to meal plan
  const assignMeal = async (weekId, day, mealType, recipeId) => {
    const newPlan = {
      ...mealPlan,
      [weekId]: {
        ...(mealPlan[weekId] || {}),
        [day]: {
          ...(mealPlan[weekId]?.[day] || {}),
          [mealType]: recipeId,
        },
      }
    };
    setMealPlan(newPlan);

    if (isApiEnabled()) {
      try {
        await api.saveMealPlan(weekId, newPlan[weekId]);
      } catch (e) {
        console.error("Error saving meal plan to server:", e);
      }
    }
  };

  // Remove recipe from meal plan
  const removeMeal = async (weekId, day, mealType) => {
    const newPlan = {
      ...mealPlan,
      [weekId]: {
        ...(mealPlan[weekId] || {}),
        [day]: {
          ...(mealPlan[weekId]?.[day] || {}),
          [mealType]: null,
        },
      }
    };
    setMealPlan(newPlan);

    if (isApiEnabled()) {
      try {
        await api.saveMealPlan(weekId, newPlan[weekId]);
      } catch (e) {
        console.error("Error removing meal plan from server:", e);
      }
    }
  };

  // Log a meal (tracker)
  const logMeal = async (date, mealType, recipeId, servings = 1, customMeal = null) => {
    const entry = {
      id: Date.now().toString(),
      date,
      mealType,
      recipeId,
      servings,
      customMeal, // Will contain { name, nutrition: { calories, protein, carbs, fat } } if manual
      timestamp: new Date().toISOString(),
    };
    setMealLog(prev => [...prev, entry]);

    if (isApiEnabled()) {
      try {
        await api.logMeal(date, mealType, recipeId, servings, customMeal);
      } catch (e) {
        console.error("Error logging meal to server:", e);
      }
    }
  };

  // Remove a logged meal
  const removeLogEntry = (entryId) => {
    setMealLog(prev => prev.filter(e => e.id !== entryId));
  };

  // Get meals for a specific date
  const getMealsForDate = (date) => {
    return mealLog.filter(e => e.date === date);
  };

  // Calculate daily nutrition from logged meals
  const getDailyNutrition = (date) => {
    const meals = getMealsForDate(date);
    const totals = {
      calories: 0, protein: 0, carbs: 0, fat: 0,
      fiber: 0, sugar: 0, sodium: 0
    };

    meals.forEach(meal => {
      if (meal.customMeal) {
        // Handle manually logged meals
        Object.keys(totals).forEach(key => {
          if (meal.customMeal.nutrition[key]) {
            totals[key] += Number(meal.customMeal.nutrition[key]);
          }
        });
      } else if (meal.recipeId) {
        // Handle recipe-based meals
        const recipe = getRecipeById(meal.recipeId);
        if (recipe) {
          const multiplier = meal.servings || 1;
          Object.keys(totals).forEach(key => {
            if (recipe.nutrition[key]) {
              totals[key] += recipe.nutrition[key] * multiplier;
            }
          });
        }
      }
    });

    return totals;
  };

  // Get weekly plan nutrition totals
  const getWeeklyPlanNutrition = (weekId) => {
    const weekTotals = {};
    const currentWeekPlan = mealPlan[weekId] || {};
    days.forEach(day => {
      const dayTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      if (currentWeekPlan[day]) {
        mealTypes.forEach(mealType => {
          const recipeId = currentWeekPlan[day][mealType];
          if (recipeId) {
            const recipe = getRecipeById(recipeId);
            if (recipe) {
              const nutrition = recipe.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0 };
              dayTotals.calories += nutrition.calories || 0;
              dayTotals.protein += nutrition.protein || 0;
              dayTotals.carbs += nutrition.carbs || 0;
              dayTotals.fat += nutrition.fat || 0;
            }
          }
        });
      }
      weekTotals[day] = dayTotals;
    });
    return weekTotals;
  };

  return (
    <MealContext.Provider value={{
      mealPlan,
      mealLog,
      assignMeal,
      removeMeal,
      logMeal,
      removeLogEntry,
      getMealsForDate,
      getDailyNutrition,
      getWeeklyPlanNutrition,
      days,
      mealTypes,
    }}>
      {children}
    </MealContext.Provider>
  );
}

export const useMeals = () => {
  const context = useContext(MealContext);
  if (!context) throw new Error('useMeals must be used within MealProvider');
  return context;
};

// Generate sample meal log for demo
function generateSampleLog() {
  const today = new Date();
  const log = [];
  const sampleRecipeIds = ['4', '9', '1', '11', '6', '3', '8', '20', '13', '17'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    mealTypes.forEach((type, idx) => {
      const recipeIdx = (i * 4 + idx) % sampleRecipeIds.length;
      log.push({
        id: `sample_${i}_${idx}`,
        date: dateStr,
        mealType: type,
        recipeId: sampleRecipeIds[recipeIdx],
        servings: 1,
        timestamp: new Date(date.getTime() + (8 + idx * 4) * 3600000).toISOString(),
      });
    });
  }

  return log;
}
