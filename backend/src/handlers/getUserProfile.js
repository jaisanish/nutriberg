const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.USERS_TABLE;

const getUserId = require('../utils/getUserId');

exports.handler = async (event) => {
  try {
    const userId = getUserId(event);

    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId },
    }));

    if (!result.Item) {
      // Create default profile for new user
      const claims = event.requestContext?.authorizer?.claims || {};
      const name = claims.name || event.headers?.['x-user-name'] || 'Demo User';
      const email = claims.email || event.headers?.['x-user-email'] || 'demo@nutriberg.com';
      const newProfile = {
        userId,
        name: name,
        email: email,
        dietaryGoals: { calories: 2000, protein: 120, carbs: 250, fat: 65 },
        restrictions: [],
        preferences: [],
        favoriteRecipes: [],
        joinedDate: new Date().toISOString(),
        streak: 0,
        recipesCooked: 0,
      };

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: newProfile,
      }));

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(newProfile),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to fetch profile' }),
    };
  }
};
