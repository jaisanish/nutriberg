const https = require('https');

const SPOONACULAR_BASE = 'https://api.spoonacular.com';
const API_KEY = process.env.SPOONACULAR_API_KEY;

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { ingredients, title } = body;

    // Option 1: Calculate from ingredient list
    if (ingredients && ingredients.length > 0) {
      const ingredientList = ingredients.join('\n');
      const url = `${SPOONACULAR_BASE}/recipes/parseIngredients?apiKey=${API_KEY}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `ingredientList=${encodeURIComponent(ingredientList)}&servings=1&includeNutrition=true`,
      });

      const data = await response.json();

      // Aggregate nutrition from all ingredients
      const totals = {
        calories: 0, protein: 0, carbs: 0, fat: 0,
        fiber: 0, sugar: 0, sodium: 0, cholesterol: 0,
      };

      data.forEach(ingredient => {
        if (ingredient.nutrition && ingredient.nutrition.nutrients) {
          ingredient.nutrition.nutrients.forEach(nutrient => {
            const name = nutrient.name.toLowerCase();
            if (name === 'calories') totals.calories += nutrient.amount;
            else if (name === 'protein') totals.protein += nutrient.amount;
            else if (name === 'carbohydrates') totals.carbs += nutrient.amount;
            else if (name === 'fat') totals.fat += nutrient.amount;
            else if (name === 'fiber') totals.fiber += nutrient.amount;
            else if (name === 'sugar') totals.sugar += nutrient.amount;
            else if (name === 'sodium') totals.sodium += nutrient.amount;
            else if (name === 'cholesterol') totals.cholesterol += nutrient.amount;
          });
        }
      });

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          nutrition: totals,
          ingredients: data,
        }),
      };
    }

    // Option 2: Guess from dish title
    if (title) {
      const url = `${SPOONACULAR_BASE}/recipes/guessNutrition?apiKey=${API_KEY}&title=${encodeURIComponent(title)}`;
      const response = await fetch(url);
      const data = await response.json();

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          nutrition: {
            calories: data.calories?.value || 0,
            protein: data.protein?.value || 0,
            carbs: data.carbs?.value || 0,
            fat: data.fat?.value || 0,
          },
        }),
      };
    }

    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Provide ingredients or title' }),
    };
  } catch (error) {
    console.error('Error calculating nutrition:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to calculate nutrition' }),
    };
  }
};
