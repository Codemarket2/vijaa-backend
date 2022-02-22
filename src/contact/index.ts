import { DB } from '../utils/DB';
import { getCurrentUser } from '../utils/authentication';
import { AppSyncEvent } from '../utils/cutomTypes';
import ContactModel from './utils/contactModel';
import { formPopulate, responsePopulate } from '../form/index';

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
          return await response.populate(formPopulate).execPopulate();
        }
        break;
      case 'getAllContacts':
        {
          const { page = 1, limit = 20, formId, parentId, search = '', formField } = args;
          let filter: any = { formId };
          if (parentId) {
            filter = { ...filter, parentId };
          }
          if (search && formField) {
            console.warn('filter');
            filter = {
              ...filter,
              $and: [
                { 'values.value': { $regex: search, $options: 'i' } },
                { 'values.field': formField },
              ],
            };
          }
          const data = await ContactModel.find(filter)
            .sort({ createdAt: -1 })
            .populate(responsePopulate)
            .limit(limit * 1)
            .skip((page - 1) * limit);
          const count = await ContactModel.countDocuments(filter);
          return {
            data,
            count,
          };
        }
        break;
      case 'getContact':
        {
          return await ContactModel.findById(args._id).populate(responsePopulate);
        }
        break;
      case 'updateContact': {
        const contact = await ContactModel.findByIdAndUpdate(args._id, args, {
          new: true,
          runValidators: true,
        });
        return await contact?.populate(responsePopulate).execPopulate();
      }
      case 'deleteContact': {
        await ContactModel.findByIdAndDelete(args._id);
        return args._id;
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
