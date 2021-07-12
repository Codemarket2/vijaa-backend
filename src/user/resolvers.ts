export const userResolvers = {
  'Query  getUsers': 'userLambda',
  'Query  getUserById': 'userLambda',
  'Query  getUserByCognitoUserId': 'userLambda',
  'Mutation createUser': 'userLambda',
  'Mutation updateUser': 'userLambda',
  'Mutation updateUserStatus': 'userLambda',
  'Mutation cancelUserSubscription': 'userLambda',
};