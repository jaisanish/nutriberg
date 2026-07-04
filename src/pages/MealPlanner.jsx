import { useState } from 'react';
import { useMeals } from '../context/MealContext';
import { getRecipeById, getAllRecipes } from '../data/recipes';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import { Calendar, Plus, X, Flame, ChevronLeft, ChevronRight } from 'lucide-react';

const dayLabels = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

const fullDayLabels = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return date.toISOString().split('T')[0];
}

export default function MealPlanner() {
  const { mealPlan, assignMeal, removeMeal, days, mealTypes, getWeeklyPlanNutrition } = useMeals();
  const { addToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const weekId = getMonday(selectedDate);
  const weeklyNutrition = getWeeklyPlanNutrition(weekId);

  const today = new Date();
  const todayDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()];

  const openRecipePicker = (day, mealType) => {
    setSelectedSlot({ day, mealType });
    setSearchQuery('');
    setModalOpen(true);
  };

  const selectRecipe = (recipeId) => {
    if (selectedSlot) {
      assignMeal(weekId, selectedSlot.day, selectedSlot.mealType, recipeId);
      addToast('Meal added to plan!', 'success');
    }
    setModalOpen(false);
  };

  const allRecipes = getAllRecipes();
  const filteredRecipes = allRecipes.filter(r =>
    (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.cuisine || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate week totals
  const weekTotal = Object.values(weeklyNutrition).reduce((acc, day) => ({
    calories: acc.calories + day.calories,
    protein: acc.protein + day.protein,
    carbs: acc.carbs + day.carbs,
    fat: acc.fat + day.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1><Calendar size={28} style={{ verticalAlign: 'middle', marginRight: 'var(--space-sm)' }} />Meal Planner</h1>
            <p>Plan your weekly meals and track nutritional goals</p>
          </div>
          <div className="flex items-center gap-md">
            <button className="btn btn-ghost" onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 7);
              setSelectedDate(d);
            }}>
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold" style={{ minWidth: '100px', textAlign: 'center' }}>
              {weekId === getMonday(new Date()) ? 'This Week' : weekId}
            </span>
            <button className="btn btn-ghost" onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 7);
              setSelectedDate(d);
            }}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="glass-card-static mb-xl">
        <div className="flex items-center justify-between">
          <h4>Weekly Nutrition Summary</h4>
          <div className="flex gap-xl">
            <div className="text-center">
              <div className="font-bold text-lg" style={{ color: 'var(--primary-light)' }}>
                {Math.round(weekTotal.calories / 7)}
              </div>
              <div className="text-xs text-muted">Avg Cal/Day</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg" style={{ color: 'var(--secondary-light)' }}>
                {Math.round(weekTotal.protein)}g
              </div>
              <div className="text-xs text-muted">Total Protein</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg" style={{ color: 'var(--accent-light)' }}>
                {Math.round(weekTotal.carbs)}g
              </div>
              <div className="text-xs text-muted">Total Carbs</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg" style={{ color: '#60a5fa' }}>
                {Math.round(weekTotal.fat)}g
              </div>
              <div className="text-xs text-muted">Total Fat</div>
            </div>
          </div>
        </div>
      </div>

      {/* Planner Grid */}
      <div className="planner-grid">
        {days.map((day) => {
          const isToday = day === todayDay;
          const dayNutrition = weeklyNutrition[day];

          return (
            <div key={day} className="day-column">
              <div className={`day-column-header ${isToday ? 'today' : ''}`}>
                <div className="day-name">{dayLabels[day]}</div>
                <div className="day-date" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Flame size={10} />
                  {Math.round(dayNutrition.calories)} cal
                </div>
                {isToday && <div className="badge badge-primary mt-sm" style={{ fontSize: '0.65rem' }}>TODAY</div>}
              </div>

              {mealTypes.map((mealType) => {
                const recipeId = mealPlan[weekId]?.[day]?.[mealType];
                const recipe = recipeId ? getRecipeById(recipeId) : null;

                return (
                  <div
                    key={mealType}
                    className={`meal-slot ${recipe ? 'filled' : ''}`}
                    onClick={() => !recipe && openRecipePicker(day, mealType)}
                  >
                    <div className="meal-slot-label">{mealType}</div>
                    {recipe ? (
                      <div className="meal-slot-content">
                        <img src={recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&q=80'} alt={recipe.title} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&q=80'; }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="meal-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {recipe.title}
                          </div>
                          <div className="meal-cals">{recipe.nutrition?.calories || 0} cal</div>
                        </div>
                        <button
                          className="btn btn-ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMeal(weekId, day, mealType);
                            addToast('Meal removed', 'info');
                          }}
                          style={{ padding: '2px', flexShrink: 0 }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center" style={{ color: 'var(--text-muted)', gap: '4px', fontSize: '0.75rem' }}>
                        <Plus size={14} /> Add
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Recipe Picker Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedSlot ? `Add ${selectedSlot.mealType} — ${fullDayLabels[selectedSlot.day]}` : 'Add Meal'}
        maxWidth="600px"
      >
        <input
          className="input mb-lg"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              className="flex items-center gap-md"
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)',
                border: '1px solid transparent',
              }}
              onClick={() => selectRecipe(recipe.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--glass-bg-hover)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <img
                src={recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&q=80'}
                alt={recipe.title}
                style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&q=80'; }}
              />
              <div style={{ flex: 1 }}>
                <div className="font-semibold text-sm">{recipe.title}</div>
                <div className="text-xs text-muted">{recipe.cuisine} • {recipe.totalTime} min</div>
              </div>
              <div className="text-sm font-semibold" style={{ color: 'var(--primary-light)' }}>
                {recipe.nutrition?.calories || 0} cal
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
