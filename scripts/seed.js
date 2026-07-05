import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-2' });
const docClient = DynamoDBDocumentClient.from(client);

const STAGE = process.env.STAGE || 'dev';
const TABLE_NAME = `NutriBerg-Recipes-${STAGE}`;

const sampleRecipes = [
  {
    recipeId: '1',
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
      { name: 'Lemon', amount: '2', unit: 'whole' }
    ],
    instructions: [
      'Preheat grill to medium-high heat.',
      'Brush salmon fillets with olive oil and squeeze fresh lemon juice over them.',
      'Grill for 5-6 minutes on each side until cooked through.'
    ],
    nutrition: { calories: 380, protein: 34, carbs: 12, fat: 22 },
    rating: 4.8,
    reviewCount: 142,
    author: 'Chef NutriBerg',
    createdAt: new Date().toISOString()
  },
  {
    recipeId: '2',
    title: 'Quinoa & Avocado Salad',
    description: 'A refreshing salad loaded with crisp cucumbers, sweet cherry tomatoes, rich avocado, and fluffy quinoa tossed in a zesty lemon dressing.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop',
    prepTime: 10,
    cookTime: 15,
    totalTime: 25,
    servings: 2,
    difficulty: 'Easy',
    cuisine: 'Mediterranean',
    category: 'Salad',
    diet: ['Vegetarian', 'Gluten-Free', 'Vegan'],
    ingredients: [
      { name: 'Quinoa', amount: '1', unit: 'cup' },
      { name: 'Avocado', amount: '1', unit: 'large' },
      { name: 'Cherry tomatoes', amount: '1', unit: 'cup' }
    ],
    instructions: [
      'Rinse quinoa and cook according to package instructions.',
      'Dice the avocado, slice tomatoes, and toss together with the cooled quinoa.',
      'Drizzle with olive oil, lemon juice, salt, and pepper.'
    ],
    nutrition: { calories: 320, protein: 8, carbs: 42, fat: 14 },
    rating: 4.6,
    reviewCount: 98,
    author: 'Chef NutriBerg',
    createdAt: new Date().toISOString()
  },
  {
    recipeId: '3',
    title: 'High-Protein Tofu Stir-Fry',
    description: 'Crispy pan-seared tofu tossed with colorful broccoli florets, snap peas, and bell peppers in a garlic ginger soy sauce.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
    prepTime: 15,
    cookTime: 15,
    totalTime: 30,
    servings: 3,
    difficulty: 'Easy',
    cuisine: 'Asian',
    category: 'Main Course',
    diet: ['Vegetarian', 'Vegan', 'High-Protein'],
    ingredients: [
      { name: 'Firm Tofu', amount: '1', unit: 'block' },
      { name: 'Broccoli', amount: '2', unit: 'cups' },
      { name: 'Soy Sauce', amount: '3', unit: 'tbsp' }
    ],
    instructions: [
      'Press tofu to remove excess moisture and cut into cubes.',
      'Pan-fry tofu in a sesame-oiled skillet until golden brown.',
      'Add vegetables and stir-fry for 5 minutes, then stir in soy sauce and ginger.'
    ],
    nutrition: { calories: 290, protein: 18, carbs: 24, fat: 12 },
    rating: 4.5,
    reviewCount: 76,
    author: 'Chef NutriBerg',
    createdAt: new Date().toISOString()
  },
  {
    recipeId: '4',
    title: 'Berry Protein Oatmeal',
    description: 'Warm rolled oats cooked with protein powder and topped with dynamic mixed berries, chia seeds, and a drizzle of honey.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop',
    prepTime: 5,
    cookTime: 5,
    totalTime: 10,
    servings: 1,
    difficulty: 'Easy',
    cuisine: 'American',
    category: 'Breakfast',
    diet: ['Vegetarian', 'High-Protein'],
    ingredients: [
      { name: 'Rolled Oats', amount: '1/2', unit: 'cup' },
      { name: 'Protein Powder', amount: '1', unit: 'scoop' },
      { name: 'Mixed Berries', amount: '1/2', unit: 'cup' }
    ],
    instructions: [
      'Combine oats and water/milk in a pot, cook on medium heat for 5 minutes.',
      'Remove from heat and stir in the protein powder until smooth.',
      'Top with fresh berries, chia seeds, and honey.'
    ],
    nutrition: { calories: 340, protein: 26, carbs: 45, fat: 6 },
    rating: 4.7,
    reviewCount: 112,
    author: 'Chef NutriBerg',
    createdAt: new Date().toISOString()
  }
];

async function seed() {
  console.log(`🚀 Starting database seeding for table: ${TABLE_NAME}...`);
  for (const recipe of sampleRecipes) {
    try {
      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: recipe
      }));
      console.log(`✅ Seeded recipe: "${recipe.title}" successfully.`);
    } catch (error) {
      console.error(`❌ Failed to seed recipe: "${recipe.title}"`, error);
    }
  }
  console.log('🎉 Seeding process completed.');
}

seed();
