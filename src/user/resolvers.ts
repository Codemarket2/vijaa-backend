export const userResolvers = {
  "Query  getUsers": "userLambda",
  "Query  getUser": "userLambda",
  "Query  getUserProfile": "userLambda",
  "Query  getAbout": "userLambda",
  "Query  getUserByCognitoUserId": "userLambda",
  "Mutation createUser": "userLambda",
  "Mutation createAbout": "userLambda",
  "Mutation updateUser": "userLambda",
  "Mutation updateUserProfile": "userLambda",
  "Mutation updateUserStatus": "userLambda",
  "Mutation cancelUserSubscription": "userLambda",
};
