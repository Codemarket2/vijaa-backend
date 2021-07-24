export const userResolvers = {
  "Query  getUsers": "userLambda",
  "Query  getUser": "userLambda",
  "Query  getUserProfile": "userLambda",
  "Query  getUserByCognitoUserId": "userLambda",
  "Mutation createUser": "userLambda",
  "Mutation updateUser": "userLambda",
  "Mutation updateUserProfile": "userLambda",
  "Mutation updateUserStatus": "userLambda",
  "Mutation cancelUserSubscription": "userLambda",
};
