import { DB } from '../utils/DB';
import { getCurrentUser } from '../utils/authentication';
import { AppSyncEvent } from '../utils/cutomTypes';
import EmailModel from './utils/emailModel';
import { sendEmail } from '../utils/email';
import { userPopulate } from '../utils/populate';

export const handler = async (event: AppSyncEvent): Promise<any> => {
  try {
    await DB();
    const {
      info: { fieldName },
      identity,
    } = event;
    const user = await getCurrentUser(identity);
    let args = { ...event.arguments };
    // const { page = 1, limit = 20, search = '', active = null, sortBy = '-createdAt' } = args;
    if (fieldName.toLocaleLowerCase().includes('create') && user && user._id) {
      args = { ...args, createdBy: user._id };
    } else if (fieldName.toLocaleLowerCase().includes('update') && user && user._id) {
      args = { ...args, updatedBy: user._id };
    }

    // sendEmail: process.env.SENDER_EMAIL,
    switch (fieldName) {
      case 'createSendEmail':
        {
          let response = await EmailModel.create(args);
          response = await response.populate(userPopulate).execPopulate();
          await sendEmail({
            from: args.senderEmail,
            to: args.receiverEmail,
            body: args.body,
            subject: args.subject,
          });
          return response;
        }
        break;
      case 'getAllEmails':
        {
          const data = await EmailModel.find().populate(userPopulate);
          const count = await EmailModel.countDocuments();
          return {
            data,
            count,
          };
        }
        break;
      default:
        throw new Error('Something went wrong! Please check your Query or Mutation');
    }
  } catch (error) {
    if (error.runThis) {
      console.log('error', error);
    }
    const error2 = error;
    throw error2;
  }
};
