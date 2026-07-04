const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.RECIPES_TABLE;

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.claims.sub;
    const body = JSON.parse(event.body);

    const recipe = {
      recipeId: uuidv4(),
      userId,
      title: body.title,
      description: body.description,
      image: body.image || '',
      prepTime: body.prepTime || 0,
      cookTime: body.cookTime || 0,
      totalTime: (body.prepTime || 0) + (body.cookTime || 0),
      servings: body.servings || 4,
      difficulty: body.difficulty || 'Medium',
      cuisine: body.cuisine || 'Other',
      category: body.category || 'Main Course',
      diet: body.diet || [],
      ingredients: body.ingredients || [],
      instructions: body.instructions || [],
      nutrition: body.nutrition || {},
      rating: 0,
      reviewCount: 0,
      author: body.author || 'Community Chef',
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: recipe,
    }));

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(recipe),
    };
  } catch (error) {
    console.error('Error creating recipe:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to create recipe' }),
    };
  }
};
