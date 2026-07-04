import { useState, useMemo } from 'react';
import { useMeals } from '../context/MealContext';
import { useAuth } from '../context/AuthContext';
import { getRecipeById } from '../data/recipes';
import ProgressBar from '../components/ProgressBar';
import { CalorieBarChart } from '../components/NutritionChart';
import { MacroChart } from '../components/NutritionChart';
import { ChevronLeft, ChevronRight, Trash2, ClipboardList, Flame, Drumstick, Wheat, Droplets, Plus } from 'lucide-react';
import Modal from '../components/Modal';

const mealTypeIcons = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export default function MealTracker() {
  const { getMealsForDate, getDailyNutrition, removeLogEntry, mealLog, logMeal } = useMeals();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Custom Meal Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customMealForm, setCustomMealForm] = useState({
    name: '', mealType: 'snack', calories: '', protein: '', carbs: '', fat: ''
  });

  const dateStr = selectedDate.toISOString().split('T')[0];
  const meals = getMealsForDate(dateStr);
  const dailyNutrition = getDailyNutrition(dateStr);
  const goals = user?.dietaryGoals || { calories: 2000, protein: 120, carbs: 250, fat: 65 };

  const isToday = dateStr === new Date().toISOString().split('T')[0];

  const changeDate = (delta) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + delta);
    setSelectedDate(next);
  };

  const handleCustomLog = (e) => {
    e.preventDefault();
    const customMeal = {
      name: customMealForm.name || 'Custom Log',
      nutrition: {
        calories: Number(customMealForm.calories) || 0,
        protein: Number(customMealForm.protein) || 0,
        carbs: Number(customMealForm.carbs) || 0,
        fat: Number(customMealForm.fat) || 0,
      }
    };
    logMeal(dateStr, (customMealForm.mealType || 'snack').toLowerCase(), null, 1, customMeal);
    setIsModalOpen(false);
    setCustomMealForm({ name: '', mealType: 'snack', calories: '', protein: '', carbs: '', fat: '' });
    
    // Attempting to import toast if not already done, or assume it's not strictly necessary. 
    // Actually, I won't add toast here to avoid missing imports, just fix the payload.
  };

  // Build weekly calorie data for chart
  const weeklyCalories = useMemo(() => {
    const data = [];
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const dn = getDailyNutrition(ds);
      data.push(Math.round(dn.calories));
      labels.push(d.toLocaleDateString('en', { weekday: 'short' }));
    }
    return { data, labels };
  }, [selectedDate, getDailyNutrition]);

  // Group meals by type
  const groupedMeals = meals.reduce((acc, meal) => {
    if (!acc[meal.mealType]) acc[meal.mealType] = [];
    acc[meal.mealType].push(meal);
    return acc;
  }, {});

  return (
    <div className="page-container">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1><ClipboardList size={28} style={{ verticalAlign: 'middle', marginRight: 'var(--space-sm)' }} />Meal Tracker</h1>
          <p>Track your daily nutrition and stay on top of your goals</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Log Custom Calories
        </button>
      </div>

      {/* Date Selector */}
      <div className="glass-card-static mb-xl">
        <div className="flex items-center justify-center gap-lg">
          <button className="btn btn-ghost" onClick={() => changeDate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <div className="font-bold text-lg">
              {selectedDate.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            {isToday && <span className="badge badge-primary mt-sm">Today</span>}
          </div>
          <button className="btn btn-ghost" onClick={() => changeDate(1)}>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Stats + Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
        {/* Nutrition Progress */}
        <div className="glass-card-static">
          <h4 className="mb-lg">Daily Progress</h4>
          <div className="flex flex-col gap-md">
            <ProgressBar label="Calories" current={dailyNutrition.calories} max={goals.calories} color="green" unit=" kcal" />
            <ProgressBar label="Protein" current={dailyNutrition.protein} max={goals.protein} color="purple" unit="g" />
            <ProgressBar label="Carbs" current={dailyNutrition.carbs} max={goals.carbs} color="orange" unit="g" />
            <ProgressBar label="Fat" current={dailyNutrition.fat} max={goals.fat} color="blue" unit="g" />
          </div>

          {/* Quick stat pills */}
          <div className="grid grid-4 mt-lg">
            <div className="text-center">
              <Flame size={18} color="var(--primary-light)" />
              <div className="font-bold mt-sm">{Math.round(dailyNutrition.calories)}</div>
              <div className="text-xs text-muted">Calories</div>
            </div>
            <div className="text-center">
              <Drumstick size={18} color="var(--secondary-light)" />
              <div className="font-bold mt-sm">{Math.round(dailyNutrition.protein)}g</div>
              <div className="text-xs text-muted">Protein</div>
            </div>
            <div className="text-center">
              <Wheat size={18} color="var(--accent-light)" />
              <div className="font-bold mt-sm">{Math.round(dailyNutrition.carbs)}g</div>
              <div className="text-xs text-muted">Carbs</div>
            </div>
            <div className="text-center">
              <Droplets size={18} color="#60a5fa" />
              <div className="font-bold mt-sm">{Math.round(dailyNutrition.fat)}g</div>
              <div className="text-xs text-muted">Fat</div>
            </div>
          </div>
        </div>

        {/* Macro Chart */}
        <div className="glass-card-static">
          <h4 className="mb-md">Macros Breakdown</h4>
          {dailyNutrition.calories > 0 ? (
            <MacroChart nutrition={dailyNutrition} size={200} />
          ) : (
            <div className="empty-state" style={{ padding: 'var(--space-xl)' }}>
              <p className="text-muted">No meals logged yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Calorie Chart */}
      <div className="glass-card-static mb-xl">
        <h4 className="mb-md">Weekly Calorie Trend</h4>
        <CalorieBarChart data={weeklyCalories.data} labels={weeklyCalories.labels} />
      </div>

      {/* Logged Meals */}
      <div className="section-header">
        <h2>Logged Meals</h2>
        <span className="text-sm text-secondary">{meals.length} entries</span>
      </div>

      {meals.length > 0 ? (
        <div className="flex flex-col gap-md">
          {Object.entries(groupedMeals).map(([type, entries]) => (
            <div key={type}>
              <div className="flex items-center gap-sm mb-sm">
                <span style={{ fontSize: '1.2rem' }}>{mealTypeIcons[type]}</span>
                <h4 style={{ textTransform: 'capitalize' }}>{type}</h4>
              </div>
              {entries.map(entry => {
                let displayData = null;
                
                if (entry.customMeal) {
                  displayData = {
                    title: entry.customMeal.name,
                    isCustom: true,
                    subtitle: 'Custom Log',
                    nutrition: entry.customMeal.nutrition
                  };
                } else if (entry.recipeId) {
                  const recipe = getRecipeById(entry.recipeId);
                  if (recipe) {
                    displayData = {
                      title: recipe.title,
                      image: recipe.image,
                      subtitle: `${entry.servings} serving${entry.servings !== 1 ? 's' : ''} • ${recipe.cuisine}`,
                      nutrition: recipe.nutrition
                    };
                  }
                }

                if (!displayData) return null;

                return (
                  <div key={entry.id} className="tracker-entry">
                    {displayData.isCustom ? (
                      <div className="tracker-entry-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        CUSTOM
                      </div>
                    ) : (
                      <img src={displayData.image} alt={displayData.title} className="tracker-entry-image" />
                    )}
                    <div className="tracker-entry-info">
                      <div className="tracker-entry-name">{displayData.title}</div>
                      <div className="tracker-entry-time">{displayData.subtitle}</div>
                    </div>
                    <div className="tracker-entry-nutrients">
                      <div className="nutrient-pill">
                        <span className="value">{displayData.nutrition.calories}</span>
                        <span className="label">Cal</span>
                      </div>
                      <div className="nutrient-pill">
                        <span className="value">{displayData.nutrition.protein}g</span>
                        <span className="label">Protein</span>
                      </div>
                      <div className="nutrient-pill">
                        <span className="value">{displayData.nutrition.carbs}g</span>
                        <span className="label">Carbs</span>
                      </div>
                      <div className="nutrient-pill">
                        <span className="value">{displayData.nutrition.fat}g</span>
                        <span className="label">Fat</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost"
                      onClick={() => removeLogEntry(entry.id)}
                      style={{ color: 'var(--danger-light)' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card-static">
          <div className="empty-state">
            <p style={{ fontSize: '3rem' }}>🍽️</p>
            <h3>No meals logged</h3>
            <p className="text-muted mt-sm">Start by exploring recipes and logging your meals</p>
          </div>
        </div>
      )}

      {/* Manual Logger Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Custom Calories">
        <form onSubmit={handleCustomLog} className="flex flex-col gap-md">
          <div className="input-group">
            <label>Meal Name</label>
            <input required className="input" placeholder="e.g. Apple, Protein Shake..." value={customMealForm.name} onChange={e => setCustomMealForm(p => ({...p, name: e.target.value}))} />
          </div>
          <div className="input-group">
            <label>Meal Type</label>
            <select className="input" value={customMealForm.mealType} onChange={e => setCustomMealForm(p => ({...p, mealType: e.target.value}))}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          <div className="grid grid-2 gap-sm">
            <div className="input-group">
              <label>Calories (kcal)</label>
              <input type="number" min="0" required className="input" value={customMealForm.calories} onChange={e => setCustomMealForm(p => ({...p, calories: e.target.value}))} />
            </div>
            <div className="input-group">
              <label>Protein (g)</label>
              <input type="number" min="0" className="input" value={customMealForm.protein} onChange={e => setCustomMealForm(p => ({...p, protein: e.target.value}))} />
            </div>
            <div className="input-group">
              <label>Carbs (g)</label>
              <input type="number" min="0" className="input" value={customMealForm.carbs} onChange={e => setCustomMealForm(p => ({...p, carbs: e.target.value}))} />
            </div>
            <div className="input-group">
              <label>Fat (g)</label>
              <input type="number" min="0" className="input" value={customMealForm.fat} onChange={e => setCustomMealForm(p => ({...p, fat: e.target.value}))} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full mt-sm">Save Log</button>
        </form>
      </Modal>
    </div>
  );
}
