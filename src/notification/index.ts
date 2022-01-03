import { AppSyncEvent } from '../utils/cutomTypes';
import { userPopulate } from '../utils/populate';
import { NotificationModel } from './utils/notificationSchema';
import { sendNotification } from './utils/sendNotification';

export const handler = async (event: AppSyncEvent): Promise<any> => {
  const {
    info: { fieldName },
  } = event;
  const args = { ...event.arguments };

  switch (fieldName) {
    case 'sendNotification': {
      return await args;
    }
    case 'callNotification': {
      await sendNotification(args);
      return args;
    }
    case 'getMyNotifications': {
      console.log({ fieldName, args });
      const data = await NotificationModel.find({ userId: args.userId }).populate(userPopulate);

      return data;
    }
    default:
      throw new Error('Something went wrong! Please check your Query or Mutation');
  }
};
