import mongoose from 'mongoose';
import { DB } from '../utils/DB';
import { getCurrentUser } from '../utils/authentication';
import { AppSyncEvent } from '../utils/cutomTypes';
import { userPopulate } from '../utils/populate';
import { EmailModel } from './utils/emailModel';
import { sendEmail } from '../utils/email';

export const handler = async (event: AppSyncEvent): Promise<any> => {
  try {
    await DB();
    const {
      info: { fieldName },
      identity,
    } = event;
    const user = await getCurrentUser(identity);
    let args = { ...event.arguments };

    if (fieldName.toLocaleLowerCase().includes('create') && user && user._id) {
      args = { ...args, createdBy: user._id };
    } else if (fieldName.toLocaleLowerCase().includes('update') && user && user._id) {
      args = { ...args, updatedBy: user._id };
    }

    // sendEmail: process.env.SENDER_EMAIL,
    switch (fieldName) {
      case 'createSendEmail':
        {
          const response = await EmailModel.create(args);
          await sendEmail({
            from: args.senderEmail,
            to: args.receiverEmail,
            body: args.body,
            subject: args.subject,
          });
          return response;
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
