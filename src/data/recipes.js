import { api, isApiEnabled } from '../services/api';

let cachedRecipes = null;

// Async background load of live database recipes if API is enabled
if (isApiEnabled()) {
  api.getRecipes().then(data => {
    if (data) {
      cachedRecipes = data;
      window.dispatchEvent(new CustomEvent('nutriberg-recipes-updated'));
    }
  }).catch(console.error);
}

export const recipes = [
  {
    id: '1',
    title: 'Mediterranean Grilled Salmon',
    description: 'Fresh Atlantic salmon fillet grilled with herbs, lemon, and olive oil. Served with a side of roasted vegetables and quinoa.',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop',
    prepTime: 15,
    cookTime: 20,
    totalTime: 35,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Mediterranean',
    category: 'Main Course',
    diet: ['Gluten-Free', 'High-Protein'],
    ingredients: [
      { name: 'Salmon fillet', amount: '4', unit: 'pieces (6oz each)' },
      { name: 'Olive oil', amount: '3', unit: 'tbsp' },
      { name: 'Lemon', amount: '2', unit: 'whole' },
      { name: 'Garlic', amount: '4', unit: 'cloves' },
      { name: 'Fresh rosemary', amount: '2', unit: 'sprigs' },
      { name: 'Cherry tomatoes', amount: '1', unit: 'cup' },
      { name: 'Kalamata olives', amount: '1/2', unit: 'cup' },
      { name: 'Salt & pepper', amount: '', unit: 'to taste' }
    ],
    instructions: [
      'Preheat grill to medium-high heat (400°F).',
      'Pat salmon fillets dry and brush with olive oil.',
      'Season generously with salt, pepper, and minced garlic.',
      'Place lemon slices and rosemary on top of each fillet.',
      'Grill for 5-6 minutes per side until internal temp reaches 145°F.',
      'Meanwhile, toss cherry tomatoes and olives with remaining olive oil.',
      'Serve salmon with tomatoes, olives, and fresh lemon wedges.'
    ],
    nutrition: {
      calories: 420,
      protein: 42,
      carbs: 8,
      fat: 24,
      fiber: 2,
      sugar: 3,
      sodium: 380,
      cholesterol: 95,
      vitaminA: 15,
      vitaminC: 25,
      calcium: 4,
      iron: 8,
      potassium: 680,
      omega3: 2.5
    },
    rating: 4.8,
    reviewCount: 234,
    author: 'Chef Maria',
    createdAt: '2024-03-15',
    tags: ['salmon', 'grilled', 'healthy', 'omega-3', 'quick']
  },
  {
    id: '2',
    title: 'Thai Green Curry with Tofu',
    description: 'A fragrant and creamy Thai green curry loaded with crispy tofu, fresh vegetables, and aromatic herbs. Served over jasmine rice.',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&h=400&fit=crop',
    prepTime: 20,
    cookTime: 25,
    totalTime: 45,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Thai',
    category: 'Main Course',
    diet: ['Vegan', 'Dairy-Free'],
    ingredients: [
      { name: 'Extra-firm tofu', amount: '14', unit: 'oz' },
      { name: 'Green curry paste', amount: '3', unit: 'tbsp' },
      { name: 'Coconut milk', amount: '1', unit: 'can (14oz)' },
      { name: 'Bell peppers', amount: '2', unit: 'medium' },
      { name: 'Bamboo shoots', amount: '1', unit: 'cup' },
      { name: 'Thai basil', amount: '1/2', unit: 'cup' },
      { name: 'Jasmine rice', amount: '2', unit: 'cups' },
      { name: 'Lime', amount: '1', unit: 'whole' }
    ],
    instructions: [
      'Press tofu for 15 minutes, then cube into 1-inch pieces.',
      'Pan-fry tofu in oil until golden and crispy on all sides.',
      'In a large wok, heat curry paste for 1 minute until fragrant.',
      'Add coconut milk and bring to a gentle simmer.',
      'Add bell peppers and bamboo shoots, cook for 5 minutes.',
      'Add crispy tofu and simmer for 10 more minutes.',
      'Stir in Thai basil and lime juice. Serve over jasmine rice.'
    ],
    nutrition: {
      calories: 385,
      protein: 18,
      carbs: 42,
      fat: 18,
      fiber: 4,
      sugar: 6,
      sodium: 520,
      cholesterol: 0,
      vitaminA: 30,
      vitaminC: 45,
      calcium: 25,
      iron: 20,
      potassium: 420,
      omega3: 0.2
    },
    rating: 4.6,
    reviewCount: 189,
    author: 'Chef Sirin',
    createdAt: '2024-04-02',
    tags: ['curry', 'vegan', 'thai', 'spicy', 'tofu']
  },
  {
    id: '3',
    title: 'Classic Caesar Salad',
    description: 'Crisp romaine lettuce tossed with homemade Caesar dressing, parmesan crisps, and garlic croutons.',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&h=400&fit=crop',
    prepTime: 15,
    cookTime: 10,
    totalTime: 25,
    servings: 2,
    difficulty: 'Easy',
    cuisine: 'Italian',
    category: 'Salad',
    diet: ['Low-Carb'],
    ingredients: [
      { name: 'Romaine lettuce', amount: '2', unit: 'heads' },
      { name: 'Parmesan cheese', amount: '1/2', unit: 'cup' },
      { name: 'Bread cubes', amount: '2', unit: 'cups' },
      { name: 'Anchovy fillets', amount: '4', unit: 'pieces' },
      { name: 'Egg yolk', amount: '1', unit: 'large' },
      { name: 'Dijon mustard', amount: '1', unit: 'tsp' },
      { name: 'Garlic', amount: '2', unit: 'cloves' },
      { name: 'Lemon juice', amount: '2', unit: 'tbsp' }
    ],
    instructions: [
      'Make croutons: Toss bread cubes with olive oil and garlic, bake at 375°F for 10 min.',
      'Make dressing: Blend anchovy, egg yolk, mustard, garlic, lemon juice.',
      'Slowly drizzle in olive oil while blending.',
      'Chop romaine into bite-size pieces and wash thoroughly.',
      'Toss lettuce with dressing until evenly coated.',
      'Top with croutons and shaved parmesan.'
    ],
    nutrition: {
      calories: 290,
      protein: 12,
      carbs: 18,
      fat: 20,
      fiber: 3,
      sugar: 2,
      sodium: 650,
      cholesterol: 55,
      vitaminA: 120,
      vitaminC: 35,
      calcium: 20,
      iron: 10,
      potassium: 350,
      omega3: 0.3
    },
    rating: 4.4,
    reviewCount: 312,
    author: 'Chef Marco',
    createdAt: '2024-02-20',
    tags: ['salad', 'caesar', 'classic', 'lunch']
  },
  {
    id: '4',
    title: 'Acai Bowl with Granola',
    description: 'A vibrant and nutrient-packed acai bowl topped with fresh berries, banana, granola, coconut flakes, and a drizzle of honey.',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=400&fit=crop',
    prepTime: 10,
    cookTime: 0,
    totalTime: 10,
    servings: 1,
    difficulty: 'Easy',
    cuisine: 'Brazilian',
    category: 'Breakfast',
    diet: ['Vegan', 'Gluten-Free'],
    ingredients: [
      { name: 'Acai puree', amount: '2', unit: 'packets (frozen)' },
      { name: 'Banana', amount: '1', unit: 'frozen' },
      { name: 'Almond milk', amount: '1/2', unit: 'cup' },
      { name: 'Granola', amount: '1/4', unit: 'cup' },
      { name: 'Blueberries', amount: '1/4', unit: 'cup' },
      { name: 'Strawberries', amount: '3', unit: 'sliced' },
      { name: 'Coconut flakes', amount: '1', unit: 'tbsp' },
      { name: 'Honey', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      'Blend acai packets with frozen banana and almond milk until thick and smooth.',
      'Pour into a bowl.',
      'Top with granola, blueberries, sliced strawberries, and coconut flakes.',
      'Drizzle honey on top. Serve immediately.'
    ],
    nutrition: {
      calories: 340,
      protein: 6,
      carbs: 62,
      fat: 10,
      fiber: 8,
      sugar: 35,
      sodium: 45,
      cholesterol: 0,
      vitaminA: 4,
      vitaminC: 50,
      calcium: 10,
      iron: 8,
      potassium: 520,
      omega3: 0.5
    },
    rating: 4.9,
    reviewCount: 456,
    author: 'Chef Luna',
    createdAt: '2024-01-10',
    tags: ['breakfast', 'acai', 'bowl', 'superfood', 'berries']
  },
  {
    id: '5',
    title: 'Spicy Korean Bibimbap',
    description: 'A colorful Korean rice bowl with marinated beef, sautéed vegetables, a fried egg, and spicy gochujang sauce.',
    image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600&h=400&fit=crop',
    prepTime: 30,
    cookTime: 20,
    totalTime: 50,
    servings: 2,
    difficulty: 'Medium',
    cuisine: 'Korean',
    category: 'Main Course',
    diet: ['High-Protein'],
    ingredients: [
      { name: 'Short grain rice', amount: '2', unit: 'cups' },
      { name: 'Beef sirloin', amount: '8', unit: 'oz' },
      { name: 'Spinach', amount: '2', unit: 'cups' },
      { name: 'Carrots', amount: '1', unit: 'large, julienned' },
      { name: 'Zucchini', amount: '1', unit: 'medium, sliced' },
      { name: 'Bean sprouts', amount: '1', unit: 'cup' },
      { name: 'Gochujang', amount: '2', unit: 'tbsp' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Sesame oil', amount: '2', unit: 'tbsp' }
    ],
    instructions: [
      'Cook rice according to package directions.',
      'Marinate sliced beef in soy sauce, sesame oil, and garlic for 15 min.',
      'Sauté each vegetable separately with a pinch of salt and sesame oil.',
      'Cook marinated beef in a hot pan until browned.',
      'Fry eggs sunny-side up.',
      'Assemble bowls: rice on bottom, arrange vegetables and beef in sections.',
      'Top with fried egg and serve with gochujang sauce on the side.'
    ],
    nutrition: {
      calories: 550,
      protein: 35,
      carbs: 65,
      fat: 16,
      fiber: 5,
      sugar: 6,
      sodium: 720,
      cholesterol: 225,
      vitaminA: 80,
      vitaminC: 20,
      calcium: 8,
      iron: 25,
      potassium: 580,
      omega3: 0.1
    },
    rating: 4.7,
    reviewCount: 178,
    author: 'Chef Kim',
    createdAt: '2024-05-12',
    tags: ['korean', 'bibimbap', 'spicy', 'rice bowl', 'beef']
  },
  {
    id: '6',
    title: 'Avocado Toast with Poached Eggs',
    description: 'Crispy sourdough toast topped with smashed avocado, perfectly poached eggs, microgreens, and a sprinkle of everything bagel seasoning.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop',
    prepTime: 10,
    cookTime: 5,
    totalTime: 15,
    servings: 2,
    difficulty: 'Easy',
    cuisine: 'American',
    category: 'Breakfast',
    diet: ['Vegetarian'],
    ingredients: [
      { name: 'Sourdough bread', amount: '2', unit: 'thick slices' },
      { name: 'Avocado', amount: '1', unit: 'ripe' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Microgreens', amount: '1/4', unit: 'cup' },
      { name: 'Everything bagel seasoning', amount: '1', unit: 'tsp' },
      { name: 'Red pepper flakes', amount: '1/4', unit: 'tsp' },
      { name: 'Lemon juice', amount: '1', unit: 'tsp' }
    ],
    instructions: [
      'Toast sourdough slices until golden and crispy.',
      'Mash avocado with lemon juice, salt, and pepper.',
      'Bring a pot of water to gentle simmer, add a splash of vinegar.',
      'Create a whirlpool and carefully drop eggs in. Poach for 3-4 minutes.',
      'Spread avocado on toast, top with poached eggs.',
      'Garnish with microgreens, everything seasoning, and red pepper flakes.'
    ],
    nutrition: {
      calories: 310,
      protein: 14,
      carbs: 28,
      fat: 18,
      fiber: 7,
      sugar: 2,
      sodium: 380,
      cholesterol: 186,
      vitaminA: 8,
      vitaminC: 12,
      calcium: 6,
      iron: 12,
      potassium: 520,
      omega3: 0.2
    },
    rating: 4.5,
    reviewCount: 567,
    author: 'Chef Alex',
    createdAt: '2024-01-25',
    tags: ['breakfast', 'avocado', 'toast', 'eggs', 'healthy']
  },
  {
    id: '7',
    title: 'Mushroom Risotto',
    description: 'Creamy Italian arborio rice slowly cooked with mixed wild mushrooms, white wine, parmesan, and fresh thyme.',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=400&fit=crop',
    prepTime: 10,
    cookTime: 35,
    totalTime: 45,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Italian',
    category: 'Main Course',
    diet: ['Vegetarian', 'Gluten-Free'],
    ingredients: [
      { name: 'Arborio rice', amount: '1.5', unit: 'cups' },
      { name: 'Mixed mushrooms', amount: '12', unit: 'oz' },
      { name: 'Vegetable broth', amount: '6', unit: 'cups' },
      { name: 'White wine', amount: '1/2', unit: 'cup' },
      { name: 'Parmesan', amount: '3/4', unit: 'cup, grated' },
      { name: 'Butter', amount: '3', unit: 'tbsp' },
      { name: 'Shallot', amount: '1', unit: 'large, diced' },
      { name: 'Fresh thyme', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      'Heat broth in a saucepan and keep warm on low.',
      'Sauté mushrooms in butter until golden, set aside.',
      'Cook shallot until translucent, add arborio rice and toast for 2 min.',
      'Add white wine and stir until absorbed.',
      'Add warm broth one ladle at a time, stirring constantly.',
      'Continue adding broth and stirring for about 20-25 minutes.',
      'Fold in mushrooms, parmesan, remaining butter, and thyme.',
      'Season and serve immediately.'
    ],
    nutrition: {
      calories: 445,
      protein: 15,
      carbs: 58,
      fat: 16,
      fiber: 3,
      sugar: 4,
      sodium: 580,
      cholesterol: 35,
      vitaminA: 6,
      vitaminC: 4,
      calcium: 18,
      iron: 10,
      potassium: 380,
      omega3: 0.1
    },
    rating: 4.7,
    reviewCount: 298,
    author: 'Chef Marco',
    createdAt: '2024-03-08',
    tags: ['risotto', 'mushroom', 'italian', 'creamy', 'comfort food']
  },
  {
    id: '8',
    title: 'Chicken Tikka Masala',
    description: 'Tender chicken pieces marinated in spiced yogurt, grilled, and simmered in a rich tomato-cream sauce with aromatic spices.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop',
    prepTime: 30,
    cookTime: 30,
    totalTime: 60,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Indian',
    category: 'Main Course',
    diet: ['Gluten-Free', 'High-Protein'],
    ingredients: [
      { name: 'Chicken thighs', amount: '1.5', unit: 'lbs' },
      { name: 'Yogurt', amount: '1', unit: 'cup' },
      { name: 'Tomato puree', amount: '2', unit: 'cups' },
      { name: 'Heavy cream', amount: '1/2', unit: 'cup' },
      { name: 'Garam masala', amount: '2', unit: 'tbsp' },
      { name: 'Turmeric', amount: '1', unit: 'tsp' },
      { name: 'Cumin', amount: '1', unit: 'tsp' },
      { name: 'Ginger-garlic paste', amount: '2', unit: 'tbsp' },
      { name: 'Basmati rice', amount: '2', unit: 'cups' }
    ],
    instructions: [
      'Marinate chicken in yogurt, garam masala, turmeric, and salt for 2+ hours.',
      'Grill or broil chicken until charred on edges.',
      'In a pan, cook onions until golden, add ginger-garlic paste.',
      'Add spices and cook for 1 minute until fragrant.',
      'Add tomato puree and simmer for 15 minutes.',
      'Stir in cream and grilled chicken pieces.',
      'Simmer for 10 more minutes. Serve over basmati rice.'
    ],
    nutrition: {
      calories: 520,
      protein: 38,
      carbs: 45,
      fat: 20,
      fiber: 3,
      sugar: 8,
      sodium: 680,
      cholesterol: 120,
      vitaminA: 25,
      vitaminC: 15,
      calcium: 12,
      iron: 18,
      potassium: 550,
      omega3: 0.1
    },
    rating: 4.9,
    reviewCount: 621,
    author: 'Chef Priya',
    createdAt: '2024-02-14',
    tags: ['indian', 'chicken', 'curry', 'tikka masala', 'spicy']
  },
  {
    id: '9',
    title: 'Greek Quinoa Salad Bowl',
    description: 'A refreshing bowl with fluffy quinoa, cucumber, tomatoes, Kalamata olives, red onion, feta cheese, and tangy lemon-herb vinaigrette.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
    prepTime: 15,
    cookTime: 15,
    totalTime: 30,
    servings: 3,
    difficulty: 'Easy',
    cuisine: 'Greek',
    category: 'Salad',
    diet: ['Vegetarian', 'High-Protein', 'Gluten-Free'],
    ingredients: [
      { name: 'Quinoa', amount: '1', unit: 'cup' },
      { name: 'Cucumber', amount: '1', unit: 'large, diced' },
      { name: 'Cherry tomatoes', amount: '1', unit: 'cup, halved' },
      { name: 'Kalamata olives', amount: '1/3', unit: 'cup' },
      { name: 'Red onion', amount: '1/4', unit: 'medium, sliced' },
      { name: 'Feta cheese', amount: '1/3', unit: 'cup, crumbled' },
      { name: 'Olive oil', amount: '3', unit: 'tbsp' },
      { name: 'Lemon juice', amount: '2', unit: 'tbsp' },
      { name: 'Fresh oregano', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      'Cook quinoa according to package directions. Fluff and cool.',
      'Dice cucumber, halve tomatoes, slice onion.',
      'Whisk together olive oil, lemon juice, oregano, salt, and pepper.',
      'Combine cooled quinoa with all vegetables.',
      'Toss with dressing.',
      'Top with crumbled feta and serve.'
    ],
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 38,
      fat: 15,
      fiber: 5,
      sugar: 4,
      sodium: 420,
      cholesterol: 15,
      vitaminA: 20,
      vitaminC: 30,
      calcium: 12,
      iron: 15,
      potassium: 440,
      omega3: 0.3
    },
    rating: 4.6,
    reviewCount: 215,
    author: 'Chef Sophia',
    createdAt: '2024-04-18',
    tags: ['salad', 'quinoa', 'greek', 'healthy', 'meal prep']
  },
  {
    id: '10',
    title: 'Japanese Miso Ramen',
    description: 'Rich and warming miso ramen with springy noodles, tender chashu pork, soft-boiled egg, corn, and nori.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop',
    prepTime: 20,
    cookTime: 40,
    totalTime: 60,
    servings: 2,
    difficulty: 'Hard',
    cuisine: 'Japanese',
    category: 'Main Course',
    diet: ['High-Protein'],
    ingredients: [
      { name: 'Ramen noodles', amount: '2', unit: 'portions' },
      { name: 'White miso paste', amount: '3', unit: 'tbsp' },
      { name: 'Chicken stock', amount: '4', unit: 'cups' },
      { name: 'Chashu pork', amount: '6', unit: 'slices' },
      { name: 'Soft-boiled eggs', amount: '2', unit: 'halved' },
      { name: 'Corn kernels', amount: '1/2', unit: 'cup' },
      { name: 'Nori sheets', amount: '2', unit: 'sheets' },
      { name: 'Green onion', amount: '2', unit: 'stalks' },
      { name: 'Sesame seeds', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      'Prepare soft-boiled eggs: boil for 6.5 min, ice bath, peel.',
      'Heat chicken stock. Dissolve miso paste into the broth.',
      'Add a splash of soy sauce, mirin, and sesame oil to the broth.',
      'Cook ramen noodles according to package (usually 2-3 min).',
      'Divide noodles into bowls, ladle hot broth over.',
      'Arrange chashu pork, egg halves, corn, nori, and green onion on top.',
      'Sprinkle sesame seeds and serve immediately.'
    ],
    nutrition: {
      calories: 580,
      protein: 32,
      carbs: 68,
      fat: 20,
      fiber: 4,
      sugar: 8,
      sodium: 1200,
      cholesterol: 180,
      vitaminA: 10,
      vitaminC: 8,
      calcium: 6,
      iron: 15,
      potassium: 480,
      omega3: 0.3
    },
    rating: 4.8,
    reviewCount: 345,
    author: 'Chef Tanaka',
    createdAt: '2024-01-30',
    tags: ['ramen', 'japanese', 'noodles', 'comfort food', 'umami']
  },
  {
    id: '11',
    title: 'Berry Protein Smoothie',
    description: 'A thick and creamy protein smoothie packed with mixed berries, banana, Greek yogurt, and a scoop of protein powder.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&h=400&fit=crop',
    prepTime: 5,
    cookTime: 0,
    totalTime: 5,
    servings: 1,
    difficulty: 'Easy',
    cuisine: 'American',
    category: 'Smoothie',
    diet: ['High-Protein', 'Gluten-Free'],
    ingredients: [
      { name: 'Mixed berries (frozen)', amount: '1', unit: 'cup' },
      { name: 'Banana', amount: '1', unit: 'medium' },
      { name: 'Greek yogurt', amount: '1/2', unit: 'cup' },
      { name: 'Protein powder', amount: '1', unit: 'scoop' },
      { name: 'Almond milk', amount: '1', unit: 'cup' },
      { name: 'Chia seeds', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      'Add almond milk and yogurt to blender first.',
      'Add frozen berries, banana, protein powder, and chia seeds.',
      'Blend on high for 60 seconds until smooth.',
      'Pour into glass and enjoy immediately.'
    ],
    nutrition: {
      calories: 320,
      protein: 28,
      carbs: 42,
      fat: 6,
      fiber: 8,
      sugar: 24,
      sodium: 180,
      cholesterol: 15,
      vitaminA: 4,
      vitaminC: 60,
      calcium: 30,
      iron: 8,
      potassium: 580,
      omega3: 1.2
    },
    rating: 4.4,
    reviewCount: 189,
    author: 'Coach Mike',
    createdAt: '2024-05-01',
    tags: ['smoothie', 'protein', 'berries', 'quick', 'post-workout']
  },
  {
    id: '12',
    title: 'Mexican Street Tacos',
    description: 'Authentic street-style tacos with seasoned carne asada, fresh pico de gallo, cilantro, onions, and a squeeze of lime on corn tortillas.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&h=400&fit=crop',
    prepTime: 20,
    cookTime: 15,
    totalTime: 35,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Mexican',
    category: 'Main Course',
    diet: ['Gluten-Free', 'High-Protein'],
    ingredients: [
      { name: 'Flank steak', amount: '1', unit: 'lb' },
      { name: 'Corn tortillas', amount: '12', unit: 'small' },
      { name: 'White onion', amount: '1', unit: 'medium, diced' },
      { name: 'Cilantro', amount: '1/2', unit: 'cup, chopped' },
      { name: 'Lime', amount: '3', unit: 'whole' },
      { name: 'Jalapeño', amount: '1', unit: 'sliced' },
      { name: 'Cumin', amount: '1', unit: 'tsp' },
      { name: 'Chili powder', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      'Marinate steak with cumin, chili powder, garlic, lime juice, and salt.',
      'Grill steak on high heat for 4-5 min per side (medium-rare).',
      'Rest for 5 minutes, then slice against the grain into thin strips.',
      'Warm tortillas on a dry skillet or directly on grill.',
      'Make pico: dice tomatoes, onion, cilantro, jalapeño with lime juice.',
      'Double-up tortillas, add sliced steak, top with pico and cilantro.',
      'Squeeze fresh lime and serve with salsa verde.'
    ],
    nutrition: {
      calories: 380,
      protein: 32,
      carbs: 35,
      fat: 12,
      fiber: 4,
      sugar: 3,
      sodium: 450,
      cholesterol: 80,
      vitaminA: 12,
      vitaminC: 30,
      calcium: 8,
      iron: 20,
      potassium: 480,
      omega3: 0.1
    },
    rating: 4.8,
    reviewCount: 412,
    author: 'Chef Carlos',
    createdAt: '2024-03-22',
    tags: ['tacos', 'mexican', 'street food', 'beef', 'grilled']
  },
  {
    id: '13',
    title: 'Overnight Oats with Mango',
    description: 'Creamy overnight oats layered with fresh mango, coconut yogurt, chia seeds, and a touch of maple syrup.',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&h=400&fit=crop',
    prepTime: 10,
    cookTime: 0,
    totalTime: 10,
    servings: 1,
    difficulty: 'Easy',
    cuisine: 'American',
    category: 'Breakfast',
    diet: ['Vegan', 'High-Fiber'],
    ingredients: [
      { name: 'Rolled oats', amount: '1/2', unit: 'cup' },
      { name: 'Almond milk', amount: '3/4', unit: 'cup' },
      { name: 'Chia seeds', amount: '1', unit: 'tbsp' },
      { name: 'Mango', amount: '1/2', unit: 'cup, diced' },
      { name: 'Coconut yogurt', amount: '1/4', unit: 'cup' },
      { name: 'Maple syrup', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      'In a jar, combine oats, almond milk, chia seeds, and maple syrup.',
      'Stir well, cover, and refrigerate overnight (or at least 4 hours).',
      'In the morning, stir oats and layer with coconut yogurt and mango.',
      'Top with extra chia seeds and enjoy cold.'
    ],
    nutrition: {
      calories: 310,
      protein: 8,
      carbs: 55,
      fat: 8,
      fiber: 9,
      sugar: 22,
      sodium: 85,
      cholesterol: 0,
      vitaminA: 18,
      vitaminC: 40,
      calcium: 25,
      iron: 12,
      potassium: 380,
      omega3: 1.8
    },
    rating: 4.5,
    reviewCount: 267,
    author: 'Chef Luna',
    createdAt: '2024-04-10',
    tags: ['breakfast', 'overnight oats', 'mango', 'meal prep', 'vegan']
  },
  {
    id: '14',
    title: 'Grilled Chicken Pesto Pasta',
    description: 'Al dente penne pasta tossed with homemade basil pesto, grilled chicken breast, sun-dried tomatoes, and toasted pine nuts.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop',
    prepTime: 15,
    cookTime: 25,
    totalTime: 40,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Italian',
    category: 'Main Course',
    diet: ['High-Protein'],
    ingredients: [
      { name: 'Penne pasta', amount: '1', unit: 'lb' },
      { name: 'Chicken breast', amount: '2', unit: 'large' },
      { name: 'Fresh basil', amount: '2', unit: 'cups packed' },
      { name: 'Pine nuts', amount: '1/3', unit: 'cup' },
      { name: 'Parmesan', amount: '1/2', unit: 'cup' },
      { name: 'Garlic', amount: '3', unit: 'cloves' },
      { name: 'Sun-dried tomatoes', amount: '1/3', unit: 'cup' },
      { name: 'Olive oil', amount: '1/3', unit: 'cup' }
    ],
    instructions: [
      'Season chicken with salt, pepper, and olive oil. Grill 6-7 min per side.',
      'Make pesto: Blend basil, pine nuts, parmesan, garlic, and olive oil.',
      'Cook penne in salted boiling water until al dente.',
      'Slice grilled chicken into strips.',
      'Toss hot pasta with pesto sauce. Reserve some pasta water.',
      'Add chicken and sun-dried tomatoes. Toss to combine.',
      'Garnish with extra pine nuts and parmesan.'
    ],
    nutrition: {
      calories: 580,
      protein: 38,
      carbs: 55,
      fat: 24,
      fiber: 3,
      sugar: 4,
      sodium: 520,
      cholesterol: 85,
      vitaminA: 15,
      vitaminC: 10,
      calcium: 18,
      iron: 15,
      potassium: 420,
      omega3: 0.2
    },
    rating: 4.6,
    reviewCount: 334,
    author: 'Chef Marco',
    createdAt: '2024-02-28',
    tags: ['pasta', 'pesto', 'chicken', 'italian', 'dinner']
  },
  {
    id: '15',
    title: 'Chocolate Lava Cake',
    description: 'Decadent individual chocolate lava cakes with a molten center, served with vanilla ice cream and fresh raspberries.',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=400&fit=crop',
    prepTime: 15,
    cookTime: 12,
    totalTime: 27,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'French',
    category: 'Dessert',
    diet: ['Vegetarian'],
    ingredients: [
      { name: 'Dark chocolate (70%)', amount: '6', unit: 'oz' },
      { name: 'Butter', amount: '1/2', unit: 'cup' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Egg yolks', amount: '2', unit: 'large' },
      { name: 'Sugar', amount: '1/4', unit: 'cup' },
      { name: 'Flour', amount: '2', unit: 'tbsp' },
      { name: 'Vanilla extract', amount: '1', unit: 'tsp' },
      { name: 'Raspberries', amount: '1/2', unit: 'cup' }
    ],
    instructions: [
      'Preheat oven to 425°F. Butter and flour 4 ramekins.',
      'Melt chocolate and butter together over double boiler.',
      'Whisk eggs, egg yolks, and sugar until thick and pale.',
      'Fold chocolate mixture into eggs. Add flour and vanilla.',
      'Divide batter among ramekins.',
      'Bake for exactly 12 minutes (edges set, center soft).',
      'Immediately invert onto plates. Serve with ice cream and raspberries.'
    ],
    nutrition: {
      calories: 480,
      protein: 8,
      carbs: 38,
      fat: 34,
      fiber: 3,
      sugar: 28,
      sodium: 120,
      cholesterol: 240,
      vitaminA: 15,
      vitaminC: 8,
      calcium: 4,
      iron: 20,
      potassium: 320,
      omega3: 0.1
    },
    rating: 4.9,
    reviewCount: 523,
    author: 'Chef Pierre',
    createdAt: '2024-02-10',
    tags: ['dessert', 'chocolate', 'lava cake', 'french', 'indulgent']
  },
  {
    id: '16',
    title: 'Vietnamese Pho',
    description: 'Aromatic beef pho with rich bone broth, rice noodles, rare beef slices, and a platter of fresh herbs, sprouts, and lime.',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=400&fit=crop',
    prepTime: 20,
    cookTime: 180,
    totalTime: 200,
    servings: 6,
    difficulty: 'Hard',
    cuisine: 'Vietnamese',
    category: 'Main Course',
    diet: ['Dairy-Free', 'Gluten-Free'],
    ingredients: [
      { name: 'Beef bones', amount: '3', unit: 'lbs' },
      { name: 'Rice noodles', amount: '1', unit: 'lb' },
      { name: 'Beef sirloin', amount: '8', unit: 'oz, thinly sliced' },
      { name: 'Star anise', amount: '4', unit: 'whole' },
      { name: 'Cinnamon stick', amount: '1', unit: 'piece' },
      { name: 'Fish sauce', amount: '3', unit: 'tbsp' },
      { name: 'Bean sprouts', amount: '2', unit: 'cups' },
      { name: 'Thai basil', amount: '1', unit: 'cup' },
      { name: 'Lime', amount: '2', unit: 'whole' }
    ],
    instructions: [
      'Roast beef bones at 400°F for 30 minutes.',
      'Transfer to large pot with water, star anise, cinnamon, ginger, onion.',
      'Simmer for 2.5-3 hours, skimming occasionally.',
      'Strain broth. Season with fish sauce and sugar.',
      'Cook rice noodles according to package.',
      'Divide noodles into bowls. Top with raw beef slices.',
      'Ladle boiling hot broth over (cooks the beef instantly).',
      'Serve with herb platter: basil, sprouts, lime, jalapeño.'
    ],
    nutrition: {
      calories: 390,
      protein: 28,
      carbs: 48,
      fat: 10,
      fiber: 2,
      sugar: 4,
      sodium: 890,
      cholesterol: 60,
      vitaminA: 5,
      vitaminC: 15,
      calcium: 4,
      iron: 18,
      potassium: 440,
      omega3: 0.1
    },
    rating: 4.8,
    reviewCount: 387,
    author: 'Chef Nguyen',
    createdAt: '2024-01-18',
    tags: ['pho', 'vietnamese', 'soup', 'noodles', 'bone broth']
  },
  {
    id: '17',
    title: 'Sweet Potato & Black Bean Burrito Bowl',
    description: 'A hearty burrito bowl with roasted sweet potato, seasoned black beans, corn salsa, guacamole, and creamy chipotle drizzle.',
    image: 'https://images.unsplash.com/photo-1543352634-a1c51d545281?w=600&h=400&fit=crop',
    prepTime: 15,
    cookTime: 25,
    totalTime: 40,
    servings: 3,
    difficulty: 'Easy',
    cuisine: 'Mexican',
    category: 'Main Course',
    diet: ['Vegan', 'Gluten-Free', 'High-Fiber'],
    ingredients: [
      { name: 'Sweet potato', amount: '2', unit: 'medium, cubed' },
      { name: 'Black beans', amount: '1', unit: 'can (15oz)' },
      { name: 'Brown rice', amount: '1', unit: 'cup' },
      { name: 'Corn', amount: '1', unit: 'cup' },
      { name: 'Avocado', amount: '1', unit: 'ripe' },
      { name: 'Chipotle in adobo', amount: '1', unit: 'pepper' },
      { name: 'Lime', amount: '2', unit: 'whole' },
      { name: 'Cilantro', amount: '1/4', unit: 'cup' }
    ],
    instructions: [
      'Preheat oven to 400°F. Toss sweet potato with oil, cumin, and chili.',
      'Roast sweet potato for 25 minutes until tender and caramelized.',
      'Cook brown rice. Season black beans with cumin and garlic.',
      'Make guacamole: Mash avocado with lime, salt, and cilantro.',
      'Make chipotle drizzle: Blend chipotle, lime juice, and a splash of oil.',
      'Assemble bowls: rice, beans, sweet potato, corn, guacamole.',
      'Drizzle with chipotle sauce and garnish with cilantro and lime.'
    ],
    nutrition: {
      calories: 420,
      protein: 14,
      carbs: 72,
      fat: 12,
      fiber: 14,
      sugar: 10,
      sodium: 380,
      cholesterol: 0,
      vitaminA: 280,
      vitaminC: 30,
      calcium: 8,
      iron: 18,
      potassium: 820,
      omega3: 0.3
    },
    rating: 4.7,
    reviewCount: 298,
    author: 'Chef Rosa',
    createdAt: '2024-04-25',
    tags: ['burrito bowl', 'vegan', 'mexican', 'sweet potato', 'meal prep']
  },
  {
    id: '18',
    title: 'Seared Ahi Tuna Steak',
    description: 'Restaurant-quality seared ahi tuna with a sesame crust, served with wasabi-ginger dipping sauce and pickled vegetables.',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600&h=400&fit=crop',
    prepTime: 15,
    cookTime: 5,
    totalTime: 20,
    servings: 2,
    difficulty: 'Medium',
    cuisine: 'Japanese',
    category: 'Main Course',
    diet: ['Low-Carb', 'High-Protein', 'Gluten-Free'],
    ingredients: [
      { name: 'Ahi tuna steaks', amount: '2', unit: '(8oz each)' },
      { name: 'Sesame seeds (mixed)', amount: '1/4', unit: 'cup' },
      { name: 'Soy sauce', amount: '3', unit: 'tbsp' },
      { name: 'Wasabi paste', amount: '1', unit: 'tsp' },
      { name: 'Fresh ginger', amount: '1', unit: 'tbsp, grated' },
      { name: 'Rice vinegar', amount: '2', unit: 'tbsp' },
      { name: 'Sesame oil', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      'Pat tuna steaks dry. Season with salt and pepper.',
      'Press sesame seeds onto all surfaces of the tuna.',
      'Heat a cast iron pan until smoking hot.',
      'Sear tuna for 45-60 seconds per side (rare center).',
      'Mix soy sauce, wasabi, ginger, rice vinegar for dipping sauce.',
      'Slice tuna against the grain. Serve with dipping sauce.'
    ],
    nutrition: {
      calories: 340,
      protein: 52,
      carbs: 6,
      fat: 12,
      fiber: 1,
      sugar: 1,
      sodium: 680,
      cholesterol: 80,
      vitaminA: 35,
      vitaminC: 4,
      calcium: 8,
      iron: 12,
      potassium: 560,
      omega3: 3.2
    },
    rating: 4.7,
    reviewCount: 167,
    author: 'Chef Tanaka',
    createdAt: '2024-05-08',
    tags: ['tuna', 'seared', 'japanese', 'seafood', 'high-protein']
  },
  {
    id: '19',
    title: 'Margherita Pizza (Homemade)',
    description: 'Classic Neapolitan-style pizza with San Marzano tomato sauce, fresh mozzarella, basil leaves, and a drizzle of olive oil.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop',
    prepTime: 120,
    cookTime: 12,
    totalTime: 132,
    servings: 4,
    difficulty: 'Hard',
    cuisine: 'Italian',
    category: 'Main Course',
    diet: ['Vegetarian'],
    ingredients: [
      { name: 'Bread flour', amount: '3', unit: 'cups' },
      { name: 'Active dry yeast', amount: '1', unit: 'packet' },
      { name: 'San Marzano tomatoes', amount: '1', unit: 'can (14oz)' },
      { name: 'Fresh mozzarella', amount: '8', unit: 'oz' },
      { name: 'Fresh basil', amount: '10', unit: 'leaves' },
      { name: 'Olive oil', amount: '2', unit: 'tbsp' },
      { name: 'Salt', amount: '1', unit: 'tsp' }
    ],
    instructions: [
      'Make dough: Mix flour, yeast, salt, water. Knead for 10 min.',
      'Let dough rise for 1.5-2 hours until doubled.',
      'Preheat oven to highest setting (500°F+) with pizza stone.',
      'Crush San Marzano tomatoes by hand for sauce. Season with salt.',
      'Stretch dough into rounds on floured surface.',
      'Spread thin layer of sauce. Add torn mozzarella pieces.',
      'Bake for 10-12 minutes until crust is charred and bubbly.',
      'Top with fresh basil and a drizzle of olive oil.'
    ],
    nutrition: {
      calories: 420,
      protein: 18,
      carbs: 52,
      fat: 16,
      fiber: 3,
      sugar: 5,
      sodium: 680,
      cholesterol: 40,
      vitaminA: 15,
      vitaminC: 20,
      calcium: 30,
      iron: 12,
      potassium: 280,
      omega3: 0.1
    },
    rating: 4.8,
    reviewCount: 445,
    author: 'Chef Marco',
    createdAt: '2024-03-01',
    tags: ['pizza', 'italian', 'homemade', 'margherita', 'classic']
  },
  {
    id: '20',
    title: 'Green Power Smoothie',
    description: 'A nutrient-dense green smoothie with spinach, kale, banana, mango, and ginger. Perfect for a morning energy boost.',
    image: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=600&h=400&fit=crop',
    prepTime: 5,
    cookTime: 0,
    totalTime: 5,
    servings: 1,
    difficulty: 'Easy',
    cuisine: 'American',
    category: 'Smoothie',
    diet: ['Vegan', 'Gluten-Free'],
    ingredients: [
      { name: 'Spinach', amount: '2', unit: 'cups' },
      { name: 'Kale', amount: '1', unit: 'cup' },
      { name: 'Banana', amount: '1', unit: 'frozen' },
      { name: 'Mango chunks', amount: '1/2', unit: 'cup, frozen' },
      { name: 'Fresh ginger', amount: '1', unit: 'inch piece' },
      { name: 'Coconut water', amount: '1', unit: 'cup' },
      { name: 'Lemon juice', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      'Add coconut water to blender.',
      'Add spinach and kale, blend until broken down.',
      'Add frozen banana, mango, ginger, and lemon juice.',
      'Blend on high until completely smooth.',
      'Pour and enjoy immediately.'
    ],
    nutrition: {
      calories: 210,
      protein: 5,
      carbs: 48,
      fat: 2,
      fiber: 6,
      sugar: 28,
      sodium: 120,
      cholesterol: 0,
      vitaminA: 180,
      vitaminC: 120,
      calcium: 12,
      iron: 15,
      potassium: 780,
      omega3: 0.3
    },
    rating: 4.3,
    reviewCount: 156,
    author: 'Coach Mike',
    createdAt: '2024-05-15',
    tags: ['smoothie', 'green', 'detox', 'vegan', 'energy']
  }
];

// Additional recipe stubs for the explore page (lightweight)
export const moreRecipes = [
  { id: '21', title: 'Shakshuka', cuisine: 'Middle Eastern', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=600&h=400&fit=crop', calories: 280, protein: 14, carbs: 18, fat: 18, totalTime: 30, rating: 4.6, diet: ['Vegetarian', 'Gluten-Free'] },
  { id: '22', title: 'Pad Thai', cuisine: 'Thai', category: 'Main Course', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=400&fit=crop', calories: 450, protein: 22, carbs: 55, fat: 16, totalTime: 30, rating: 4.7, diet: ['Gluten-Free'] },
  { id: '23', title: 'Caprese Salad', cuisine: 'Italian', category: 'Salad', image: 'https://images.unsplash.com/photo-1608032077018-c9aad9565d29?w=600&h=400&fit=crop', calories: 220, protein: 12, carbs: 6, fat: 16, totalTime: 10, rating: 4.5, diet: ['Vegetarian', 'Low-Carb'] },
  { id: '24', title: 'Chicken Shawarma', cuisine: 'Middle Eastern', category: 'Main Course', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc383?w=600&h=400&fit=crop', calories: 480, protein: 35, carbs: 38, fat: 20, totalTime: 45, rating: 4.8, diet: ['High-Protein'] },
  { id: '25', title: 'Banana Pancakes', cuisine: 'American', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop', calories: 320, protein: 10, carbs: 48, fat: 10, totalTime: 20, rating: 4.4, diet: ['Vegetarian'] },
  { id: '26', title: 'Tom Yum Soup', cuisine: 'Thai', category: 'Soup', image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=600&h=400&fit=crop', calories: 180, protein: 15, carbs: 12, fat: 8, totalTime: 25, rating: 4.6, diet: ['Gluten-Free', 'Low-Calorie'] },
  { id: '27', title: 'Falafel Wrap', cuisine: 'Middle Eastern', category: 'Main Course', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc383?w=600&h=400&fit=crop', calories: 410, protein: 16, carbs: 48, fat: 18, totalTime: 40, rating: 4.5, diet: ['Vegan'] },
  { id: '28', title: 'Beef Bulgogi', cuisine: 'Korean', category: 'Main Course', image: 'https://images.unsplash.com/photo-1583224964978-2257b960c3f3?w=600&h=400&fit=crop', calories: 420, protein: 30, carbs: 35, fat: 18, totalTime: 35, rating: 4.7, diet: ['Dairy-Free'] },
  { id: '29', title: 'Matcha Latte Bowl', cuisine: 'Japanese', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=400&fit=crop', calories: 240, protein: 8, carbs: 36, fat: 8, totalTime: 10, rating: 4.3, diet: ['Vegan'] },
  { id: '30', title: 'Lamb Kofta Kebabs', cuisine: 'Middle Eastern', category: 'Main Course', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop', calories: 380, protein: 28, carbs: 12, fat: 24, totalTime: 30, rating: 4.6, diet: ['Gluten-Free', 'High-Protein'] },
];

// Cuisine options
export const cuisines = [
  'All', 'Mediterranean', 'Thai', 'Italian', 'Indian', 'Japanese',
  'Mexican', 'Korean', 'Greek', 'Vietnamese', 'American',
  'Brazilian', 'French', 'Middle Eastern'
];

// Diet options
export const diets = [
  'All', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free',
  'Low-Carb', 'High-Protein', 'High-Fiber', 'Low-Calorie', 'Nut-Free', 'Soy-Free', 'Halal', 'Pescatarian'
];

// Categories
export const categories = [
  'All', 'Breakfast', 'Main Course', 'Salad', 'Soup',
  'Smoothie', 'Dessert', 'Snack', 'Side Dish'
];

// Daily recommended values (FDA)
export const dailyValues = {
  calories: 2000,
  protein: 50,
  carbs: 300,
  fat: 65,
  fiber: 25,
  sugar: 50,
  sodium: 2300,
  cholesterol: 300,
  vitaminA: 100,
  vitaminC: 100,
  calcium: 100,
  iron: 100,
  potassium: 4700
};

// Sample community comments
export const sampleComments = [
  { id: 'c1', userId: 'u2', author: 'Sarah K.', avatar: 'SK', text: 'Made this last night and it was incredible! The whole family loved it. Will definitely make again.', timestamp: '2024-05-20T14:30:00Z', rating: 5 },
  { id: 'c2', userId: 'u3', author: 'David M.', avatar: 'DM', text: 'Great recipe! I added some extra garlic and used fresh herbs from my garden. Turned out amazing.', timestamp: '2024-05-18T09:15:00Z', rating: 4 },
  { id: 'c3', userId: 'u4', author: 'Emily R.', avatar: 'ER', text: 'Easy to follow instructions. I substituted the butter with olive oil for a healthier version.', timestamp: '2024-05-15T16:45:00Z', rating: 4 },
  { id: 'c4', userId: 'u5', author: 'James L.', avatar: 'JL', text: 'This has become a weekly staple in our house. My kids even eat their vegetables with this!', timestamp: '2024-05-12T11:20:00Z', rating: 5 },
  { id: 'c5', userId: 'u6', author: 'Mia W.', avatar: 'MW', text: 'The nutrition info is so helpful. Perfectly fits my macro goals. Thank you!', timestamp: '2024-05-10T08:00:00Z', rating: 5 },
];

// Sample meal plan template
export const sampleMealPlan = {
  monday: {
    breakfast: '4',  // Acai Bowl
    lunch: '9',      // Greek Quinoa Salad
    dinner: '1',     // Grilled Salmon
    snack: '11'      // Berry Protein Smoothie
  },
  tuesday: {
    breakfast: '6',  // Avocado Toast
    lunch: '3',      // Caesar Salad
    dinner: '8',     // Chicken Tikka Masala
    snack: '20'      // Green Smoothie
  },
  wednesday: {
    breakfast: '13', // Overnight Oats
    lunch: '17',     // Burrito Bowl
    dinner: '7',     // Mushroom Risotto
    snack: '11'      // Berry Smoothie
  },
  thursday: {
    breakfast: '4',  // Acai Bowl
    lunch: '9',      // Quinoa Salad
    dinner: '12',    // Street Tacos
    snack: '20'      // Green Smoothie
  },
  friday: {
    breakfast: '6',  // Avocado Toast
    lunch: '2',      // Thai Green Curry
    dinner: '18',    // Seared Ahi Tuna
    snack: '11'      // Berry Smoothie
  },
  saturday: {
    breakfast: '13', // Overnight Oats
    lunch: '5',      // Bibimbap
    dinner: '19',    // Margherita Pizza
    snack: '20'      // Green Smoothie
  },
  sunday: {
    breakfast: '4',  // Acai Bowl
    lunch: '10',     // Miso Ramen
    dinner: '14',    // Pesto Pasta
    snack: '15'      // Chocolate Lava Cake (treat day!)
  }
};

// Helper functions for data access
const CUSTOM_RECIPES_KEY = 'nutriberg_custom_recipes';
const DELETED_RECIPES_KEY = 'nutriberg_deleted_recipes';
const REVIEWS_KEY = 'nutriberg_recipe_reviews';

export const getRecipeReviews = (recipeId) => {
  const reviewsStr = localStorage.getItem(REVIEWS_KEY);
  if (!reviewsStr) return [];
  const allReviews = JSON.parse(reviewsStr);
  return allReviews[recipeId] || [];
};

export const addRecipeReview = (recipeId, review) => {
  const reviewsStr = localStorage.getItem(REVIEWS_KEY);
  const allReviews = reviewsStr ? JSON.parse(reviewsStr) : {};
  if (!allReviews[recipeId]) allReviews[recipeId] = [];
  allReviews[recipeId].push(review);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));
};

export const getAllRecipes = () => {
  if (isApiEnabled() && cachedRecipes) {
    return cachedRecipes;
  }

  const customStr = localStorage.getItem(CUSTOM_RECIPES_KEY);
  const customRecipes = customStr ? JSON.parse(customStr) : [];
  
  const stubs = moreRecipes.map(r => ({
    ...r,
    description: 'A delicious recipe with amazing flavors.',
    prepTime: Math.floor(r.totalTime * 0.4),
    cookTime: Math.floor(r.totalTime * 0.6),
    servings: 4,
    difficulty: r.totalTime > 30 ? 'Medium' : 'Easy',
    ingredients: [],
    instructions: [],
    nutrition: { calories: r.calories, protein: r.protein, carbs: r.carbs, fat: r.fat, fiber: 4, sugar: 6, sodium: 400, cholesterol: 30, vitaminA: 10, vitaminC: 15, calcium: 8, iron: 10, potassium: 400, omega3: 0.2 },
    reviewCount: Math.floor(Math.random() * 300) + 50,
    author: 'Chef NutriBerg',
    createdAt: '2024-04-01',
    tags: [r.cuisine.toLowerCase(), r.category.toLowerCase()]
  }));
  
  const baseRecipes = [...recipes, ...stubs];
  const all = [...customRecipes, ...baseRecipes];
  
  const deletedStr = localStorage.getItem(DELETED_RECIPES_KEY);
  const deletedIds = deletedStr ? JSON.parse(deletedStr) : [];
  
  const reviewsStr = localStorage.getItem(REVIEWS_KEY);
  const allReviews = reviewsStr ? JSON.parse(reviewsStr) : {};
  
  const validRecipes = all.filter(r => !deletedIds.includes(r.id));
  
  validRecipes.forEach(r => {
    // Initialize defaults if missing
    if (!r.reviewCount) r.reviewCount = Math.floor(Math.random() * 300) + 50;
    if (!r.rating) r.rating = 4.5;
    
    const userReviews = allReviews[r.id] || [];
    if (userReviews.length > 0) {
      const sumUserRatings = userReviews.reduce((sum, rev) => sum + rev.rating, 0);
      const totalRating = (r.rating * r.reviewCount) + sumUserRatings;
      r.reviewCount = r.reviewCount + userReviews.length;
      r.rating = totalRating / r.reviewCount;
    }
  });
  
  return validRecipes;
};

export const getRecipeById = (id) => {
  return getAllRecipes().find(r => r.id === id) || null;
};

export const deleteRecipe = (id) => {
  if (id.startsWith('custom_')) {
    const customStr = localStorage.getItem(CUSTOM_RECIPES_KEY);
    if (customStr) {
      let customRecipes = JSON.parse(customStr);
      customRecipes = customRecipes.filter(r => r.id !== id);
      localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(customRecipes));
    }
  } else {
    const deletedStr = localStorage.getItem(DELETED_RECIPES_KEY);
    const deletedIds = deletedStr ? JSON.parse(deletedStr) : [];
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem(DELETED_RECIPES_KEY, JSON.stringify(deletedIds));
    }
  }
};

export const getRecipesByCuisine = (cuisine) => {
  return getAllRecipes().filter(r => r.cuisine === cuisine);
};

export const getRecipesByDiet = (diet) => {
  return getAllRecipes().filter(r => r.diet && r.diet.includes(diet));
};

export const getRecipesByCategory = (category) => {
  return getAllRecipes().filter(r => r.category === category);
};


