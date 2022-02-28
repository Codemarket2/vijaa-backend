import { DB } from '../utils/DB';
import { getCurrentUser } from '../utils/authentication';
import { AppSyncEvent } from '../utils/cutomTypes';
import EmailModel, { EmailCampaign, EmailTemplate } from './utils/emailModel';
import { sendEmail } from '../utils/email';
import { userPopulate } from '../utils/populate';
import { createTemplate, deleteTemplate, updateTemplate } from './utils/sesCreateEmailTemplate';
import { sendBulkTemplatedEmail } from './utils/sesTemplateEmail';

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
      case 'getOneEmailTemplate':
        {
          return await EmailTemplate.findById(event.arguments.id);
        }
        break;
      case 'getAllEmailTemplatesByUserId':
        {
          return await EmailTemplate.find({ userId: event.arguments.userId });
        }
        break;
      case 'getAllEmailTemplates':
        {
          return await EmailTemplate.find();
        }
        break;
      case 'createOneEmailTemplate':
        {
          await createTemplate(event.arguments);
          return await EmailTemplate.create(event.arguments);
        }
        break;
      case 'updateOneEmailTemplate':
        {
          await updateTemplate(event.arguments);
          return await EmailTemplate.findByIdAndUpdate(event.arguments.id, event.arguments, {
            new: true,
            runValidators: true,
          });
        }
        break;
      case 'deleteOneEmailTemplate':
        {
          await deleteTemplate(event.arguments);
          return await EmailTemplate.findByIdAndDelete(event.arguments.id);
        }
        break;
      case 'getOneEmailCampaign':
        {
          return await EmailCampaign.findById(event.arguments.id);
        }
        break;
      case 'getAllEmailCampaignsByUserId':
        {
          return await EmailCampaign.find({ userId: event.arguments.userId });
        }
        break;
      case 'getAllEmailCampaigns':
        {
          return await EmailCampaign.find();
        }
        break;
      case 'createOneEmailCampaign':
        {
          const cRes = await sendBulkTemplatedEmail(event.arguments);
          return await EmailCampaign.create({
            campaignRes: cRes,
            ...event.arguments,
          });
        }
        break;
      case 'updateOneEmailCampaign':
        {
          return await EmailCampaign.findByIdAndUpdate(event.arguments.id, event.arguments, {
            new: true,
            runValidators: true,
          });
        }
        break;
      case 'deleteOneEmailCampaign':
        {
          return await EmailCampaign.findByIdAndDelete(event.arguments.id);
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
