import { DB } from '../utils/DB';
import { getCurrentUser } from '../utils/authentication';
import { AppSyncEvent } from '../utils/cutomTypes';
import ContactModel from './utils/contactModel';
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

    if (fieldName.toLocaleLowerCase().includes('create') && user && user._id) {
      args = { ...args, createdBy: user._id };
    } else if (fieldName.toLocaleLowerCase().includes('update') && user && user._id) {
      args = { ...args, updatedBy: user._id };
    }

    switch (fieldName) {
      case 'createContact':
        {
          const response = await ContactModel.create(args);
          return await response.populate(userPopulate).execPopulate();
        }
        break;
      case 'getAllContacts':
        {
          const data = await ContactModel.find().populate(userPopulate);
          const count = await ContactModel.countDocuments();
          return {
            data,
            count,
          };
        }
        break;
      case 'getContact':
        {
          return await ContactModel.findById(args).populate(userPopulate);
        }
        break;
      case 'updateContact': {
        const contact = await ContactModel.findByIdAndUpdate(args._id, args, {
          new: true,
          runValidators: true,
        });
        return await contact?.populate(userPopulate).execPopulate();
      }
      case 'deleteContact': {
        await ContactModel.findByIdAndDelete(args._id);
        return true;
      }
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
