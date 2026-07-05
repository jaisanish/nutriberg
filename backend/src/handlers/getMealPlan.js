const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.MEAL_PLANS_TABLE;

const getUserId = require('../utils/getUserId');

exports.handler = async (event) => {
  try {
    const userId = getUserId(event);
    const { weekId } = event.pathParameters;

    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId, weekId },
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result.Item || { meals: {} }),
    };
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to fetch meal plan' }),
    };
  }
};
