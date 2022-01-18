import { AppSyncEvent } from '../utils/cutomTypes';
import { NotificationModel } from './utils/notificationSchema';
import { sendNotification } from './utils/sendNotification';
import { DB } from '../utils/DB';
import { getCurrentUser } from '../utils/authentication';

export const handler = async (event: AppSyncEvent): Promise<any> => {
  const {
    info: { fieldName },
    identity,
  } = event;
  const args = { ...event.arguments };
  await DB();
  const user = await getCurrentUser(identity);

  switch (fieldName) {
    case 'sendNotification': {
      return await args;
    }
    case 'callNotification': {
      await sendNotification(args);
      return args;
    }
    case 'getMyNotifications': {
      const data = await NotificationModel.aggregate([
        {
          $match: {
            userId: user._id,
          },
        },
        {
          $group: {
            _id: '$formId',
            lastNotification: {
              $first: '$$ROOT',
            },
            notificationCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'forms',
            localField: '_id',
            foreignField: '_id',
            as: 'formId',
          },
        },
        {
          $unwind: '$formId',
        },
      ]);
      const count = await NotificationModel.countDocuments({ userId: user._id });
      return {
        data,
        count,
      };
    }
    default:
      throw new Error('Something went wrong! Please check your Query or Mutation');
  }
};
