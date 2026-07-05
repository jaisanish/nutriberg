import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { api, isApiEnabled } from '../services/api';
import { cuisines, categories, diets } from '../data/recipes';
import { Plus, Minus, ChefHat, Image as ImageIcon, CheckCircle, Flame, Clock } from 'lucide-react';

export default function AddRecipe() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Other',
    category: 'Main Course',
    diet: [],
  });

  const [ingredients, setIngredients] = useState([{ amount: '1', unit: 'cup', name: '' }]);
  const [instructions, setInstructions] = useState(['']);
  
  const [nutrition, setNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.image || ingredients[0].name === '') {
      addToast('Please fill out the title, image URL, and at least 1 ingredient', 'danger');
      return;
    }

    const newRecipe = {
      id: `custom_${Date.now()}`,
      ...form,
      totalTime: Number(form.prepTime) + Number(form.cookTime),
      ingredients: ingredients.filter(i => i.name.trim() !== ''),
      instructions: instructions.filter(i => i.trim() !== ''),
      nutrition,
      author: user?.name || 'Community Chef',
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    };

    const CUSTOM_KEY = 'nutriberg_custom_recipes';
    const stored = localStorage.getItem(CUSTOM_KEY);
    const customRecipes = stored ? JSON.parse(stored) : [];
    customRecipes.push(newRecipe);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customRecipes));

    if (isApiEnabled()) {
      api.createRecipe(newRecipe).catch(e => {
        console.error("Error creating recipe on backend:", e);
      });
    }

    addToast('Recipe added successfully!', 'success');
    navigate('/explore');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><ChefHat size={28} style={{ verticalAlign: 'middle', marginRight: 'var(--space-sm)' }} />Add New Recipe</h1>
        <p>Share your culinary creations with the NutriBerg community</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-xl">
        {/* Basic Info */}
        <div className="glass-card-static">
          <h3 className="mb-lg flex items-center gap-sm"><CheckCircle size={20} color="var(--primary-light)"/> Basic Information</h3>
          <div className="grid grid-2 gap-lg mb-lg">
            <div className="input-group">
              <label>Recipe Title *</label>
              <input required className="input" placeholder="e.g. Avocado Toast" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Image URL *</label>
              <div style={{ position: 'relative' }}>
                <ImageIcon size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input required className="input" placeholder="https://..." style={{ paddingLeft: 42 }} value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
              </div>
            </div>
          </div>
          
          <div className="input-group mb-lg">
            <label>Description</label>
            <textarea className="input" rows="3" placeholder="Describe your recipe..." value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
          </div>

          <div className="grid grid-4 gap-md">
            <div className="input-group">
              <label>Prep Time (min)</label>
              <input type="number" required className="input" value={form.prepTime} onChange={e => setForm({...form, prepTime: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Cook Time (min)</label>
              <input type="number" required className="input" value={form.cookTime} onChange={e => setForm({...form, cookTime: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Servings</label>
              <input type="number" required className="input" value={form.servings} onChange={e => setForm({...form, servings: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Difficulty</label>
              <select className="input" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categorization */}
        <div className="glass-card-static">
          <h3 className="mb-lg">Categorization</h3>
          <div className="grid grid-2 gap-lg mb-lg">
            <div className="input-group">
              <label>Cuisine</label>
              <select className="input" value={form.cuisine} onChange={e => setForm({...form, cuisine: e.target.value})}>
                {cuisines.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Category</label>
              <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="input-group">
            <label>Dietary Tags (Select multiple)</label>
            <div className="search-filters" style={{ marginTop: 'var(--space-xs)' }}>
              {diets.filter(d => d !== 'All').map(d => (
                <button
                  key={d} type="button"
                  className={`filter-chip ${form.diet.includes(d) ? 'active' : ''}`}
                  onClick={() => {
                    const nextDiets = form.diet.includes(d) ? form.diet.filter(x => x !== d) : [...form.diet, d];
                    setForm({...form, diet: nextDiets});
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="glass-card-static">
          <div className="flex items-center justify-between mb-lg">
            <h3>Ingredients</h3>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIngredients([...ingredients, { amount: '', unit: '', name: '' }])}>
              <Plus size={16} /> Add Ingredient
            </button>
          </div>
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-sm mb-sm animate-slide-up">
              <input className="input" style={{ width: '100px' }} placeholder="Amount" value={ing.amount} onChange={e => { const newI = [...ingredients]; newI[i].amount = e.target.value; setIngredients(newI); }} />
              <input className="input" style={{ width: '120px' }} placeholder="Unit" value={ing.unit} onChange={e => { const newI = [...ingredients]; newI[i].unit = e.target.value; setIngredients(newI); }} />
              <input className="input" style={{ flex: 1 }} placeholder="Ingredient Name" value={ing.name} onChange={e => { const newI = [...ingredients]; newI[i].name = e.target.value; setIngredients(newI); }} />
              <button type="button" className="btn btn-ghost" onClick={() => { if(ingredients.length > 1) setIngredients(ingredients.filter((_, idx) => idx !== i)); }}><Minus size={18} color="var(--danger-light)"/></button>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="glass-card-static">
          <div className="flex items-center justify-between mb-lg">
            <h3>Instructions</h3>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setInstructions([...instructions, ''])}>
              <Plus size={16} /> Add Step
            </button>
          </div>
          {instructions.map((step, i) => (
            <div key={i} className="flex gap-sm mb-sm animate-slide-up items-start">
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{i + 1}</div>
              <textarea className="input" style={{ flex: 1 }} rows="2" placeholder="Describe this step..." value={step} onChange={e => { const newInst = [...instructions]; newInst[i] = e.target.value; setInstructions(newInst); }} />
              <button type="button" className="btn btn-ghost" onClick={() => { if(instructions.length > 1) setInstructions(instructions.filter((_, idx) => idx !== i)); }}><Minus size={18} color="var(--danger-light)"/></button>
            </div>
          ))}
        </div>

        {/* Nutrition */}
        <div className="glass-card-static">
          <h3 className="mb-lg flex items-center gap-sm"><Flame size={20} color="var(--primary-light)"/> Nutrition Info (Per Serving)</h3>
          <div className="grid grid-4 gap-md">
            <div className="input-group">
              <label>Calories (kcal) *</label>
              <input type="number" required className="input" value={nutrition.calories} onChange={e => setNutrition({...nutrition, calories: Number(e.target.value)})} />
            </div>
            <div className="input-group">
              <label>Protein (g)</label>
              <input type="number" required className="input" value={nutrition.protein} onChange={e => setNutrition({...nutrition, protein: Number(e.target.value)})} />
            </div>
            <div className="input-group">
              <label>Carbs (g)</label>
              <input type="number" required className="input" value={nutrition.carbs} onChange={e => setNutrition({...nutrition, carbs: Number(e.target.value)})} />
            </div>
            <div className="input-group">
              <label>Fat (g)</label>
              <input type="number" required className="input" value={nutrition.fat} onChange={e => setNutrition({...nutrition, fat: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-md">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/explore')}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-lg">Publish Recipe</button>
        </div>
      </form>
    </div>
  );
}
