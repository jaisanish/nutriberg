import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getRecipeById, sampleComments, getRecipeReviews, addRecipeReview } from '../data/recipes';
import { useAuth } from '../context/AuthContext';
import { useMeals } from '../context/MealContext';
import { useToast } from '../components/Toast';
import { MacroChart, MicroChart } from '../components/NutritionChart';
import NutritionLabel from '../components/NutritionLabel';
import RatingStars from '../components/RatingStars';
import Modal from '../components/Modal';
import {
  ArrowLeft, Clock, Users, ChefHat, Heart, Share2,
  Printer, BookmarkPlus, Flame, Timer, BarChart3
} from 'lucide-react';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, toggleFavorite } = useAuth();
  const { logMeal } = useMeals();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('ingredients');
  const [servingsMultiplier, setServingsMultiplier] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [localReviews, setLocalReviews] = useState([]);

  // Load reviews on mount or when id changes
  useEffect(() => {
    setLocalReviews(getRecipeReviews(id));
  }, [id]);

  const recipe = getRecipeById(id);

  if (!recipe) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>Recipe not found</h2>
          <button className="btn btn-primary mt-lg" onClick={() => navigate('/explore')}>
            Browse Recipes
          </button>
        </div>
      </div>
    );
  }

  const isFavorite = user?.favoriteRecipes?.includes(recipe.id);
  const adjustedNutrition = Object.fromEntries(
    Object.entries(recipe.nutrition).map(([key, val]) => [key, val * servingsMultiplier])
  );

  const handleLogMeal = (mealType) => {
    logMeal(logDate, mealType, recipe.id, servingsMultiplier);
    addToast(`${recipe.title} logged as ${mealType}!`, 'success');
    setIsLogModalOpen(false);
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      addToast('Sign in to save favorites', 'info');
      return;
    }
    toggleFavorite(recipe.id);
    addToast(isFavorite ? 'Removed from favorites' : 'Added to favorites!', 'success');
  };

  return (
    <div className="page-container">
      {/* Back Button */}
      <button
        className="btn btn-ghost mb-lg"
        onClick={() => navigate(-1)}
        style={{ gap: 'var(--space-sm)' }}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Hero Image + Info */}
      <div className="glass-card-static" style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--space-xl)' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={recipe.image}
            alt={recipe.title}
            style={{ width: '100%', height: '350px', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            padding: 'var(--space-2xl) var(--space-xl) var(--space-lg)',
          }}>
            <div className="flex items-center gap-sm mb-sm">
              {recipe.diet.map(d => (
                <span key={d} className="badge badge-primary">{d}</span>
              ))}
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>{recipe.title}</h1>
            <div className="flex items-center gap-lg text-sm text-secondary">
              <span className="flex items-center gap-xs"><ChefHat size={16} /> {recipe.author}</span>
              <span className="flex items-center gap-xs"><Clock size={16} /> {recipe.totalTime} min</span>
              <span className="flex items-center gap-xs"><Users size={16} /> {recipe.servings} servings</span>
              <span className="flex items-center gap-xs"><Flame size={16} /> {recipe.nutrition.calories} cal</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between" style={{ padding: 'var(--space-md) var(--space-xl)', borderTop: '1px solid var(--glass-border)' }}>
          <div className="flex items-center gap-md">
            <RatingStars rating={recipe.rating} />
            <span className="text-sm text-secondary">
              {recipe.rating} ({recipe.reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <button className={`btn btn-ghost ${isFavorite ? 'text-primary-color' : ''}`} onClick={handleFavorite}>
              <Heart size={20} fill={isFavorite ? 'var(--danger)' : 'none'} color={isFavorite ? 'var(--danger)' : 'currentColor'} />
            </button>
            <button className="btn btn-ghost"><Share2 size={20} /></button>
            <button className="btn btn-ghost"><Printer size={20} /></button>
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsLogModalOpen(true)}
              >
                <BookmarkPlus size={16} />
                Log Meal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-xl)', alignItems: 'start' }}>
        {/* Left Column */}
        <div>
          {/* Description */}
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 'var(--space-xl)', color: 'var(--text-secondary)' }}>
            {recipe.description}
          </p>

          {/* Quick Info */}
          <div className="grid grid-3 mb-xl">
            <div className="glass-card-static text-center">
              <Timer size={24} color="var(--primary-light)" />
              <div className="font-bold mt-sm">{recipe.prepTime} min</div>
              <div className="text-xs text-muted">Prep Time</div>
            </div>
            <div className="glass-card-static text-center">
              <Flame size={24} color="var(--accent-light)" />
              <div className="font-bold mt-sm">{recipe.cookTime} min</div>
              <div className="text-xs text-muted">Cook Time</div>
            </div>
            <div className="glass-card-static text-center">
              <BarChart3 size={24} color="var(--secondary-light)" />
              <div className="font-bold mt-sm">{recipe.difficulty}</div>
              <div className="text-xs text-muted">Difficulty</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'ingredients' ? 'active' : ''}`}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients
            </button>
            <button
              className={`tab ${activeTab === 'instructions' ? 'active' : ''}`}
              onClick={() => setActiveTab('instructions')}
            >
              Instructions
            </button>
            <button
              className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Comments ({sampleComments.length + localReviews.length})
            </button>
          </div>

          {/* Ingredients */}
          {activeTab === 'ingredients' && (
            <div className="glass-card-static animate-fade-in">
              {/* Serving Adjuster */}
              <div className="flex items-center gap-md mb-lg">
                <span className="text-sm text-secondary">Servings:</span>
                <div className="flex items-center gap-sm">
                  {[0.5, 1, 1.5, 2, 3].map(mult => (
                    <button
                      key={mult}
                      className={`filter-chip ${servingsMultiplier === mult ? 'active' : ''}`}
                      onClick={() => setServingsMultiplier(mult)}
                    >
                      {mult * recipe.servings}
                    </button>
                  ))}
                </div>
              </div>

              <ul style={{ listStyle: 'none' }}>
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} style={{
                    padding: 'var(--space-sm) 0',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                  }}>
                    <input type="checkbox" id={`ing-${i}`} style={{
                      width: 18, height: 18, accentColor: 'var(--primary)',
                    }} />
                    <label htmlFor={`ing-${i}`} className="text-secondary" style={{ cursor: 'pointer' }}>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {ing.amount && `${parseFloat(ing.amount) * servingsMultiplier} `}
                      </span>
                      {ing.unit} {ing.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {activeTab === 'instructions' && (
            <div className="glass-card-static animate-fade-in">
              <ol style={{ listStyle: 'none', counterReset: 'step' }}>
                {recipe.instructions.map((step, i) => (
                  <li key={i} style={{
                    counterIncrement: 'step',
                    display: 'flex',
                    gap: 'var(--space-md)',
                    padding: 'var(--space-md) 0',
                    borderBottom: i < recipe.instructions.length - 1 ? '1px solid var(--glass-border)' : 'none',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 'var(--radius-full)',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--primary-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <p className="text-secondary" style={{ paddingTop: '4px' }}>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Comments */}
          {activeTab === 'comments' && (
            <div className="glass-card-static animate-fade-in">
              {isAuthenticated && (
                <div className="mb-lg" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: 'var(--space-lg)' }}>
                  <div className="flex items-center gap-md mb-md">
                    <span className="text-sm">Your Rating:</span>
                    <RatingStars rating={userRating} onRate={setUserRating} interactive />
                  </div>
                  <div className="flex gap-md">
                    <input
                      className="input"
                      placeholder="Share your thoughts on this recipe..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        if (newComment.trim()) {
                          const newReview = {
                            id: `rev_${Date.now()}`,
                            author: user?.name || 'Anonymous',
                            avatar: user?.name ? user.name.substring(0, 2).toUpperCase() : 'AN',
                            text: newComment.trim(),
                            rating: userRating || 5, // default to 5 if not selected
                            timestamp: new Date().toISOString()
                          };
                          addRecipeReview(recipe.id, newReview);
                          setLocalReviews([...localReviews, newReview]);
                          addToast('Comment posted! Recipe rating updated.', 'success');
                          setNewComment('');
                          setUserRating(0);
                        }
                      }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic user reviews */}
              {localReviews.slice().reverse().map(comment => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-avatar" style={{ background: 'var(--primary)', color: '#000' }}>{comment.avatar}</div>
                  <div className="comment-body">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <RatingStars rating={comment.rating} size={12} />
                      <span className="comment-time">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="comment-text">{comment.text}</div>
                  </div>
                </div>
              ))}

              {sampleComments.map(comment => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-avatar">{comment.avatar}</div>
                  <div className="comment-body">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <RatingStars rating={comment.rating} size={12} />
                      <span className="comment-time">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="comment-text">{comment.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vitamins & Minerals (Moved from right column) */}
          <div className="glass-card-static mt-lg">
            <h4 className="mb-md">Vitamins & Minerals</h4>
            <MicroChart nutrition={adjustedNutrition} />
          </div>
        </div>

        {/* Right Column — Nutrition */}
        <div style={{ position: 'sticky', top: 'var(--space-xl)' }}>
          {/* Nutrition Facts Label */}
          <NutritionLabel nutrition={adjustedNutrition} servings={recipe.servings} />

          {/* Macro Chart */}
          <div className="glass-card-static mb-lg mt-lg">
            <h4 className="mb-md">Macronutrient Breakdown</h4>
            <MacroChart nutrition={adjustedNutrition} size={240} />
            <div className="grid grid-3 mt-lg text-center">
              <div>
                <div className="font-bold" style={{ color: 'var(--primary-light)' }}>
                  {Math.round(adjustedNutrition.protein)}g
                </div>
                <div className="text-xs text-muted">Protein</div>
              </div>
              <div>
                <div className="font-bold" style={{ color: 'var(--secondary-light)' }}>
                  {Math.round(adjustedNutrition.carbs)}g
                </div>
                <div className="text-xs text-muted">Carbs</div>
              </div>
              <div>
                <div className="font-bold" style={{ color: 'var(--accent-light)' }}>
                  {Math.round(adjustedNutrition.fat)}g
                </div>
                <div className="text-xs text-muted">Fat</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Log Meal Modal */}
      <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title="Log This Meal" maxWidth="400px">
        <div className="flex flex-col gap-md pt-sm">
          <div className="input-group">
            <label>Date</label>
            <input 
              type="date" 
              className="input" 
              value={logDate} 
              onChange={(e) => setLogDate(e.target.value)} 
              style={{ width: '100%' }}
            />
          </div>
          <div className="input-group">
            <label>Meal Type</label>
            <div className="grid grid-2 gap-sm mt-xs">
              {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                <button
                  key={type}
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleLogMeal(type)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
