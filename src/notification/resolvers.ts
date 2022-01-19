export const notificationResolvers = {
  'Mutation sendNotification': 'notificationLambda',
  'Mutation callNotification': 'notificationLambda',
  'Query getMyNotifications': 'notificationLambda',
  'Query getNotificationList': 'notificationLambda',
};
