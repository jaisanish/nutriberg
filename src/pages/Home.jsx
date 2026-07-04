import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMeals } from '../context/MealContext';
import { recipes } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import { Flame, Drumstick, Wheat, Droplets, ChefHat, Trophy, Calendar, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getDailyNutrition } = useMeals();

  const today = new Date().toISOString().split('T')[0];
  const dailyNutrition = getDailyNutrition(today);
  const goals = user?.dietaryGoals || { calories: 2000, protein: 120, carbs: 250, fat: 65 };

  const featuredRecipes = recipes.slice(0, 6);
  const trendingRecipes = [...recipes].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="hero" id="home-hero">
        <div className="hero-content">
          <h1>
            Eat Smarter,<br />
            <span className="gradient-text">Live Better</span>
          </h1>
          <p>
            Discover thousands of recipes with detailed nutritional information.
            Plan your meals, track your nutrition, and achieve your health goals.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/explore')}>
              <ChefHat size={20} />
              Explore Recipes
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/planner')}>
              <Calendar size={20} />
              Plan Meals
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="number gradient-text">500+</div>
              <div className="text">Recipes</div>
            </div>
            <div className="hero-stat">
              <div className="number gradient-text">50+</div>
              <div className="text">Cuisines</div>
            </div>
            <div className="hero-stat">
              <div className="number gradient-text">10K+</div>
              <div className="text">Active Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Nutrition Summary */}
      {isAuthenticated && (
        <section className="mb-xl">
          <div className="section-header">
            <h2>Today's Progress</h2>
            <span className="see-all" onClick={() => navigate('/tracker')}>
              View Tracker <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
            </span>
          </div>

          <div className="grid grid-4 mb-lg">
            <StatCard
              icon={Flame}
              label="Calories"
              value={Math.round(dailyNutrition.calories)}
              trend={0}
              color="green"
            />
            <StatCard
              icon={Drumstick}
              label="Protein"
              value={`${Math.round(dailyNutrition.protein)}g`}
              trend={0}
              color="purple"
            />
            <StatCard
              icon={Wheat}
              label="Carbs"
              value={`${Math.round(dailyNutrition.carbs)}g`}
              trend={0}
              color="orange"
            />
            <StatCard
              icon={Droplets}
              label="Fat"
              value={`${Math.round(dailyNutrition.fat)}g`}
              trend={0}
              color="blue"
            />
          </div>

          <div className="glass-card-static">
            <div className="flex flex-col gap-md">
              <ProgressBar
                label="Calories"
                current={dailyNutrition.calories}
                max={goals.calories}
                color="green"
                unit=" kcal"
              />
              <ProgressBar
                label="Protein"
                current={dailyNutrition.protein}
                max={goals.protein}
                color="purple"
                unit="g"
              />
              <ProgressBar
                label="Carbs"
                current={dailyNutrition.carbs}
                max={goals.carbs}
                color="orange"
                unit="g"
              />
              <ProgressBar
                label="Fat"
                current={dailyNutrition.fat}
                max={goals.fat}
                color="blue"
                unit="g"
              />
            </div>
          </div>
        </section>
      )}

      {/* Featured Recipes */}
      <section className="mb-xl">
        <div className="section-header">
          <h2>Featured Recipes</h2>
          <span className="see-all" onClick={() => navigate('/explore')}>
            See All <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
          </span>
        </div>
        <div className="grid grid-3">
          {featuredRecipes.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} />
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="mb-xl">
        <div className="section-header">
          <h2>🔥 Trending Now</h2>
        </div>
        <div className="grid grid-3">
          {trendingRecipes.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      {!isAuthenticated && (
        <section className="mb-xl">
          <div className="glass-accent" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <Trophy size={40} color="var(--accent-light)" style={{ marginBottom: 'var(--space-md)' }} />
            <h2 style={{ marginBottom: 'var(--space-sm)' }}>Join NutriBerg Today</h2>
            <p style={{ marginBottom: 'var(--space-lg)', maxWidth: 500, margin: '0 auto var(--space-lg)' }}>
              Create a free account to track your meals, plan your week, and get personalized recipe recommendations.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/auth')}>
              Get Started Free
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
