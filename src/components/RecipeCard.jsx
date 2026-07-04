import { Clock, Star, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecipeCard({ recipe, index = 0, onDelete }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <div
      className="recipe-card"
      onClick={handleClick}
      style={{ animationDelay: `${index * 0.05}s` }}
      role="button"
      tabIndex={0}
      id={`recipe-card-${recipe.id}`}
    >
      <div className="recipe-card-image-wrapper">
        <img
          src={recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&q=80'}
          alt={recipe.title}
          className="recipe-card-image"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&q=80'; }}
        />
        <div className="recipe-card-badges">
          {(recipe.diet || []).slice(0, 2).map((diet) => (
            <span key={diet} className="badge badge-primary">{diet}</span>
          ))}
        </div>
        <div className="recipe-card-time">
          <span className="badge badge-secondary">
            <Clock size={12} />
            {recipe.totalTime || recipe.prepTime || 15} min
          </span>
        </div>
        {onDelete && (
          <button 
            className="btn btn-ghost recipe-delete-btn" 
            style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px', background: 'rgba(0,0,0,0.5)', zIndex: 10 }}
            onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}
            title="Delete recipe"
          >
            <Trash2 size={16} color="var(--danger-light)" />
          </button>
        )}
      </div>

      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <p className="text-sm text-muted" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {recipe.description || `${recipe.cuisine} • ${recipe.category}`}
        </p>

        <div className="recipe-card-meta">
          <div className="recipe-card-nutrients">
            <div className="nutrient-pill">
              <span className="value">{recipe.nutrition?.calories || recipe.calories}</span>
              <span className="label">Cal</span>
            </div>
            <div className="nutrient-pill">
              <span className="value">{recipe.nutrition?.protein || recipe.protein}g</span>
              <span className="label">Protein</span>
            </div>
            <div className="nutrient-pill">
              <span className="value">{recipe.nutrition?.carbs || recipe.carbs || 0}g</span>
              <span className="label">Carbs</span>
            </div>
            <div className="nutrient-pill" style={{ display: 'none' }}>
              <span className="value">{recipe.nutrition?.fat || recipe.fat || 0}g</span>
            </div>
          </div>

          <div className="flex items-center gap-xs">
            <Star size={14} fill="var(--accent)" color="var(--accent)" />
            <span className="text-sm font-semibold">{recipe.rating?.toFixed(1) || '4.5'}</span>
            <span className="text-xs text-muted" style={{ marginLeft: '2px' }}>
              ({recipe.reviewCount || Math.floor(Math.random() * 300) + 50})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
