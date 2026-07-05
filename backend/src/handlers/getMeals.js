const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.MEAL_LOGS_TABLE;

const getUserId = require('../utils/getUserId');

exports.handler = async (event) => {
  try {
    const userId = getUserId(event);
    const { startDate, endDate } = event.queryStringParameters || {};

    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
    };

    // Optionally filter by date range
    if (startDate && endDate) {
      params.KeyConditionExpression += ' AND dateMealType BETWEEN :start AND :end';
      params.ExpressionAttributeValues[':start'] = startDate;
      params.ExpressionAttributeValues[':end'] = endDate + '#~'; // ~ sorts after all chars
    }

    const result = await docClient.send(new QueryCommand(params));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        meals: result.Items,
        count: result.Count,
      }),
    };
  } catch (error) {
    console.error('Error fetching meals:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to fetch meals' }),
    };
  }
};
