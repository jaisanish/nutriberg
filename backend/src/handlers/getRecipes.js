const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.RECIPES_TABLE;

exports.handler = async (event) => {
  try {
    const { cuisine, category, diet, search, limit, lastKey } = event.queryStringParameters || {};

    let params = {
      TableName: TABLE_NAME,
      Limit: parseInt(limit) || 20,
    };

    if (lastKey) {
      params.ExclusiveStartKey = JSON.parse(Buffer.from(lastKey, 'base64').toString());
    }

    let result;

    // Use GSI for cuisine or category filters
    if (cuisine) {
      params.IndexName = 'cuisine-index';
      params.KeyConditionExpression = 'cuisine = :cuisine';
      params.ExpressionAttributeValues = { ':cuisine': cuisine };
      result = await docClient.send(new QueryCommand(params));
    } else if (category) {
      params.IndexName = 'category-index';
      params.KeyConditionExpression = 'category = :category';
      params.ExpressionAttributeValues = { ':category': category };
      result = await docClient.send(new QueryCommand(params));
    } else {
      // Full table scan with optional text search
      if (search) {
        params.FilterExpression = 'contains(#title, :search) OR contains(cuisine, :search)';
        params.ExpressionAttributeNames = { '#title': 'title' };
        params.ExpressionAttributeValues = { ':search': search.toLowerCase() };
      }
      result = await docClient.send(new ScanCommand(params));
    }

    // Build pagination token
    const nextKey = result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        recipes: result.Items,
        nextKey,
        count: result.Count,
      }),
    };
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to fetch recipes' }),
    };
  }
};
