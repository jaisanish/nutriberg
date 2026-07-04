import { dailyValues } from '../data/recipes';

export default function NutritionLabel({ nutrition, servings = 1 }) {
  const dv = (nutrient, value) => {
    const dvVal = dailyValues[nutrient];
    if (!dvVal) return '';
    return `${Math.round((value / dvVal) * 100)}%`;
  };

  return (
    <div className="nutrition-label" id="nutrition-facts-label">
      <div className="nutrition-label-title">Nutrition Facts</div>
      <div className="nutrition-label-serving">
        Serving Size: 1 serving ({servings} servings per recipe)
      </div>

      <div className="nutrition-row bold" style={{ borderBottom: '4px solid var(--text-primary)', paddingBottom: '4px' }}>
        <span>Calories</span>
        <span style={{ fontSize: '1.2rem' }}>{nutrition.calories}</span>
      </div>

      <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        % Daily Value*
      </div>

      <div className="nutrition-row bold">
        <span>Total Fat {nutrition.fat}g</span>
        <span className="dv">{dv('fat', nutrition.fat)}</span>
      </div>
      <div className="nutrition-row indent">
        <span>Saturated Fat {Math.round(nutrition.fat * 0.3)}g</span>
        <span className="dv">{dv('fat', nutrition.fat * 0.3)}</span>
      </div>

      <div className="nutrition-row bold">
        <span>Cholesterol {nutrition.cholesterol}mg</span>
        <span className="dv">{dv('cholesterol', nutrition.cholesterol)}</span>
      </div>

      <div className="nutrition-row bold">
        <span>Sodium {nutrition.sodium}mg</span>
        <span className="dv">{dv('sodium', nutrition.sodium)}</span>
      </div>

      <div className="nutrition-row bold">
        <span>Total Carbohydrate {nutrition.carbs}g</span>
        <span className="dv">{dv('carbs', nutrition.carbs)}</span>
      </div>
      <div className="nutrition-row indent">
        <span>Dietary Fiber {nutrition.fiber}g</span>
        <span className="dv">{dv('fiber', nutrition.fiber)}</span>
      </div>
      <div className="nutrition-row indent">
        <span>Total Sugars {nutrition.sugar}g</span>
        <span></span>
      </div>

      <div className="nutrition-row bold" style={{ borderBottom: '8px solid var(--text-primary)' }}>
        <span>Protein {nutrition.protein}g</span>
        <span className="dv">{dv('protein', nutrition.protein)}</span>
      </div>

      <div className="nutrition-row">
        <span>Vitamin A</span>
        <span className="dv">{nutrition.vitaminA}%</span>
      </div>
      <div className="nutrition-row">
        <span>Vitamin C</span>
        <span className="dv">{nutrition.vitaminC}%</span>
      </div>
      <div className="nutrition-row">
        <span>Calcium</span>
        <span className="dv">{nutrition.calcium}%</span>
      </div>
      <div className="nutrition-row" style={{ borderBottom: '4px solid var(--text-primary)' }}>
        <span>Iron</span>
        <span className="dv">{nutrition.iron}%</span>
      </div>

      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
        * Percent Daily Values are based on a 2,000 calorie diet.
      </p>
    </div>
  );
}
