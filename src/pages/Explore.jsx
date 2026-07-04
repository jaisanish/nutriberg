import { useState, useMemo } from 'react';
import { getAllRecipes, cuisines, diets, categories, deleteRecipe } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';

export default function Explore() {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedDiet, setSelectedDiet] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [refreshCount, setRefreshCount] = useState(0);

  const allRecipes = useMemo(() => getAllRecipes(), [refreshCount]);

  const handleDelete = (id) => {
    deleteRecipe(id);
    setRefreshCount(prev => prev + 1);
  };

  const filtered = useMemo(() => {
    let result = allRecipes;

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.cuisine?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q) ||
        (r.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    // Cuisine filter
    if (selectedCuisine !== 'All') {
      result = result.filter(r => r.cuisine === selectedCuisine);
    }

    // Diet filter
    if (selectedDiet !== 'All') {
      result = result.filter(r => (r.diet || []).includes(selectedDiet));
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(r => r.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'time':
        result.sort((a, b) => a.totalTime - b.totalTime);
        break;
      case 'calories-low':
        result.sort((a, b) => (a.nutrition?.calories || a.calories) - (b.nutrition?.calories || b.calories));
        break;
      case 'calories-high':
        result.sort((a, b) => (b.nutrition?.calories || b.calories) - (a.nutrition?.calories || a.calories));
        break;
      case 'protein':
        result.sort((a, b) => (b.nutrition?.protein || b.protein) - (a.nutrition?.protein || a.protein));
        break;
      default:
        break;
    }

    return result;
  }, [search, selectedCuisine, selectedDiet, selectedCategory, sortBy, allRecipes]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Explore Recipes</h1>
        <p>Discover delicious and nutritious recipes from around the world</p>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        onFilterToggle={() => setShowFilters(!showFilters)}
      />

      {showFilters && (
        <div className="glass-card-static mt-lg animate-slide-up" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
          {/* Cuisine */}
          <div className="mb-md">
            <label className="text-xs text-muted font-semibold" style={{ display: 'block', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Cuisine
            </label>
            <div className="search-filters" style={{ marginTop: 0 }}>
              {cuisines.map(c => (
                <button
                  key={c}
                  className={`filter-chip ${selectedCuisine === c ? 'active' : ''}`}
                  onClick={() => setSelectedCuisine(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Diet */}
          <div className="mb-md">
            <label className="text-xs text-muted font-semibold" style={{ display: 'block', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Diet
            </label>
            <div className="search-filters" style={{ marginTop: 0 }}>
              {diets.map(d => (
                <button
                  key={d}
                  className={`filter-chip ${selectedDiet === d ? 'active' : ''}`}
                  onClick={() => setSelectedDiet(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="mb-md">
            <label className="text-xs text-muted font-semibold" style={{ display: 'block', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Category
            </label>
            <div className="search-filters" style={{ marginTop: 0 }}>
              {categories.map(c => (
                <button
                  key={c}
                  className={`filter-chip ${selectedCategory === c ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="mb-md">
            <label className="text-xs text-muted font-semibold" style={{ display: 'block', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Sort by
            </label>
            <div className="search-filters" style={{ marginTop: 0 }}>
              {[
                { value: 'rating', label: 'Highest Rated' },
                { value: 'time', label: 'Quickest' },
                { value: 'calories-low', label: 'Lowest Calories' },
                { value: 'calories-high', label: 'Highest Calories' },
                { value: 'protein', label: 'Most Protein' },
              ].map(opt => (
                <button
                  key={opt.value}
                  className={`filter-chip ${sortBy === opt.value ? 'active' : ''}`}
                  onClick={() => setSortBy(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex items-center justify-between mt-lg mb-md">
        <p className="text-secondary">
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{filtered.length}</span> recipes found
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-auto">
          {filtered.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🍽️</p>
          <h3>No recipes found</h3>
          <p className="mt-sm">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}
