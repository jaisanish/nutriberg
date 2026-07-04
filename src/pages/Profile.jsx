import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMeals } from '../context/MealContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { getRecipeById, diets, getAllRecipes } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';
import ProgressBar from '../components/ProgressBar';
import {
  User, Settings, Heart, Award, Flame,
  Target, Calendar, Save, ChefHat
} from 'lucide-react';

export default function Profile() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { mealLog } = useMeals();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [editGoals, setEditGoals] = useState(false);
  const [goals, setGoals] = useState(user?.dietaryGoals || { calories: 2000, protein: 120, carbs: 250, fat: 65 });

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <User size={48} />
          <h2 className="mt-md">Sign in to view your profile</h2>
          <button className="btn btn-primary mt-lg" onClick={() => navigate('/auth')}>Sign In</button>
        </div>
      </div>
    );
  }

  const favoriteRecipes = (user.favoriteRecipes || [])
    .map(id => getRecipeById(id))
    .filter(Boolean);

  const saveGoals = () => {
    updateProfile({ dietaryGoals: goals });
    setEditGoals(false);
    addToast('Goals updated!', 'success');
  };

  const recipesCooked = mealLog?.length || 0;
  const uniqueCuisines = new Set(mealLog?.map(m => m.recipeId ? getRecipeById(m.recipeId)?.cuisine : null).filter(Boolean)).size;
  const saladsLogged = mealLog?.filter(m => m.recipeId && getRecipeById(m.recipeId)?.title.toLowerCase().includes('salad')).length || 0;
  
  const uniqueDates = [...new Set(mealLog?.map(m => m.date))].sort();
  const totalDaysLogged = uniqueDates.length;
  let maxStreak = 0;
  
  if (uniqueDates.length > 0) {
    let currentStreak = 1;
    maxStreak = 1;
    let prevDate = new Date(uniqueDates[0]);
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const currDate = new Date(uniqueDates[i]);
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
      
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
      prevDate = currDate;
    }
  }

  return (
    <div className="page-container">
      {/* Profile Header */}
      <div className="glass-card-static mb-xl" style={{ padding: 'var(--space-2xl)' }}>
        <div className="flex items-center gap-xl">
          <div style={{
            width: 80, height: 80, borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, flexShrink: 0,
            boxShadow: '0 8px 30px var(--primary-glow)',
          }}>
            {user.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ marginBottom: 'var(--space-xs)' }}>{user.name}</h1>
            <p className="text-secondary">{user.email}</p>
            <div className="flex gap-sm mt-md">
              {(user.restrictions || []).map(r => (
                <span key={r} className="badge badge-primary">{r}</span>
              ))}
              {(user.preferences || []).map(p => (
                <span key={p} className="badge badge-secondary">{p}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-xl">
            <div className="text-center">
              <div className="font-bold text-xl">{totalDaysLogged}</div>
              <div className="text-xs text-muted">Days Logged</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl">{recipesCooked}</div>
              <div className="text-xs text-muted">Recipes Cooked</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl">{favoriteRecipes.length}</div>
              <div className="text-xs text-muted">Favorites</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs mb-xl">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`tab ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveTab('goals')}>
          Goals & Diet
        </button>
        <button className={`tab ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
          Favorites ({favoriteRecipes.length})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          <div className="grid grid-4 mb-xl">
            <div className="glass-card-static text-center">
              <Flame size={28} color="var(--primary-light)" />
              <div className="font-bold text-xl mt-sm">{goals.calories}</div>
              <div className="text-xs text-muted">Daily Cal Goal</div>
            </div>
            <div className="glass-card-static text-center">
              <Target size={28} color="var(--secondary-light)" />
              <div className="font-bold text-xl mt-sm">{goals.protein}g</div>
              <div className="text-xs text-muted">Protein Goal</div>
            </div>
            <div className="glass-card-static text-center">
              <Award size={28} color="var(--accent-light)" />
              <div className="font-bold text-xl mt-sm">{totalDaysLogged}</div>
              <div className="text-xs text-muted">Total Days Logged</div>
            </div>
            <div className="glass-card-static text-center">
              <Calendar size={28} color="#60a5fa" />
              <div className="font-bold text-xl mt-sm">
                {new Date(user.joinedDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
              </div>
              <div className="text-xs text-muted">Member Since</div>
            </div>
          </div>

          <div className="glass-card-static">
            <h3 className="mb-lg">Achievements</h3>
            <div className="grid grid-3 gap-lg">
              {[
                { icon: '🔥', title: 'Hot Streak', desc: `Max Streak: ${maxStreak} days`, unlocked: maxStreak >= 7 },
                { icon: '👨‍🍳', title: 'Home Chef', desc: 'Cooked 25+ recipes', unlocked: recipesCooked >= 25 },
                { icon: '💪', title: 'Protein Pro', desc: 'Hit protein goal 7 days', unlocked: recipesCooked >= 14 },
                { icon: '🥗', title: 'Salad Lover', desc: 'Logged 3+ salads', unlocked: saladsLogged >= 3 },
                { icon: '🌍', title: 'World Explorer', desc: 'Cooked 3+ cuisines', unlocked: uniqueCuisines >= 3 },
                { icon: '📊', title: 'Data Nerd', desc: 'Tracked meals for 30 days', unlocked: recipesCooked >= 30 },
              ].map((ach, i) => (
                <div key={i} className={`glass-card-static text-center ${!ach.unlocked ? 'text-muted' : ''}`}
                  style={{ opacity: ach.unlocked ? 1 : 0.4 }}>
                  <div style={{ fontSize: '2rem' }}>{ach.icon}</div>
                  <div className="font-semibold mt-sm">{ach.title}</div>
                  <div className="text-xs text-muted">{ach.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="animate-fade-in">
          <div className="glass-card-static mb-xl">
            <div className="flex items-center justify-between mb-lg">
              <h3>Daily Nutrition Goals</h3>
              {!editGoals ? (
                <button className="btn btn-secondary btn-sm" onClick={() => setEditGoals(true)}>
                  <Settings size={16} /> Edit Goals
                </button>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={saveGoals}>
                  <Save size={16} /> Save
                </button>
              )}
            </div>

            <div className="grid grid-2 gap-lg">
              {[
                { key: 'calories', label: 'Calories', unit: 'kcal', color: 'green', max: 4000 },
                { key: 'protein', label: 'Protein', unit: 'g', color: 'purple', max: 300 },
                { key: 'carbs', label: 'Carbohydrates', unit: 'g', color: 'orange', max: 500 },
                { key: 'fat', label: 'Fat', unit: 'g', color: 'blue', max: 150 },
              ].map(({ key, label, unit, color, max }) => (
                <div key={key} className="input-group">
                  <label>{label} ({unit})</label>
                  {editGoals ? (
                    <input
                      type="number"
                      className="input"
                      value={goals[key]}
                      onChange={(e) => setGoals(prev => ({ ...prev, [key]: parseInt(e.target.value) || 0 }))}
                      min={0}
                      max={max}
                    />
                  ) : (
                    <div className="font-bold text-lg">{goals[key]} {unit}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card-static">
            <h3 className="mb-lg">Dietary Preferences</h3>
            <div className="search-filters" style={{ marginTop: 0 }}>
              {diets.filter(d => d !== 'All').map(d => (
                <button
                  key={d}
                  className={`filter-chip ${(user.restrictions || []).includes(d) || (user.preferences || []).includes(d) ? 'active' : ''}`}
                  onClick={() => {
                    const current = [...(user.restrictions || []), ...(user.preferences || [])];
                    const updated = current.includes(d)
                      ? current.filter(x => x !== d)
                      : [...current, d];
                    updateProfile({ preferences: updated });
                    addToast(`Preference updated`, 'success');
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div className="animate-fade-in">
          {favoriteRecipes.length > 0 ? (
            <div className="grid grid-auto">
              {favoriteRecipes.map((recipe, i) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={i} />
              ))}
            </div>
          ) : (
            <div className="glass-card-static">
              <div className="empty-state">
                <Heart size={48} />
                <h3 className="mt-md">No favorites yet</h3>
                <p className="text-muted mt-sm">Heart recipes to save them here</p>
                <button className="btn btn-primary mt-lg" onClick={() => navigate('/explore')}>
                  <ChefHat size={18} /> Explore Recipes
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
