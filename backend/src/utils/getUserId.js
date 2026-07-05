module.exports = (event) => {
  try {
    if (event.requestContext?.authorizer?.claims?.sub) {
      return event.requestContext.authorizer.claims.sub;
    }
  } catch (e) {}

  // Support headers from client when Cognito is disabled/restricted
  const authHeader = event.headers?.['authorization'] || event.headers?.['Authorization'];
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (token && token !== 'null' && token !== 'undefined') {
      return token;
    }
  }

  const userIdHeader = event.headers?.['x-user-id'] || event.headers?.['X-User-Id'];
  if (userIdHeader) {
    return userIdHeader.trim();
  }

  return 'u1'; // Default demo user ID
};
