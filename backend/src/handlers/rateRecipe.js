const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const RATINGS_TABLE = process.env.RATINGS_TABLE;
const RECIPES_TABLE = process.env.RECIPES_TABLE;

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.claims.sub;
    const { id: recipeId } = event.pathParameters;
    const { rating } = JSON.parse(event.body);

    if (!rating || rating < 1 || rating > 5) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Rating must be between 1 and 5' }),
      };
    }

    // Save/update user rating
    await docClient.send(new PutCommand({
      TableName: RATINGS_TABLE,
      Item: {
        recipeId,
        userId,
        rating,
        timestamp: new Date().toISOString(),
      },
    }));

    // Update recipe average rating (simplified — production would use a stream)
    await docClient.send(new UpdateCommand({
      TableName: RECIPES_TABLE,
      Key: { recipeId },
      UpdateExpression: 'SET reviewCount = if_not_exists(reviewCount, :zero) + :one',
      ExpressionAttributeValues: {
        ':zero': 0,
        ':one': 1,
      },
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Rating saved', rating }),
    };
  } catch (error) {
    console.error('Error rating recipe:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to rate recipe' }),
    };
  }
};
