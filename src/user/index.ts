/* eslint-disable no-case-declarations */
import { DB } from '../utils/DB';
import { User } from './utils/userModel';
import { adminToggleUserStatus } from './utils/helper';
import { AppSyncEvent } from '../utils/cutomTypes';

export const handler = async (event: AppSyncEvent): Promise<any> => {
  try {
    await DB();
    const { fieldName } = event.info;
    const { arguments: args, identity } = event;
    const tempFilter: any = {};
    let tempSubscription = {};
    let users: any = [];
    let count = 0;

    switch (fieldName) {
      case 'getUsers':
        const {
          page = 1,
          limit = 10,
          search = '',
          lowerRange = null,
          higherRange = null,
          sortBy = '-createdAtDate',
          active = null,
        } = args;

        if (active !== null) {
          tempFilter.active = active;
        }

        if (lowerRange !== null && higherRange !== null) {
          tempFilter.createdAt = {
            $gte: lowerRange,
            $lte: higherRange,
          };
        }

        users = await User.find({
          ...tempFilter,
          $or: [
            {
              email: { $regex: search, $options: 'i' },
            },
            {
              name: { $regex: search, $options: 'i' },
            },
          ],
        })
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .sort(sortBy)
          .exec();

        count = await User.countDocuments({
          ...tempFilter,
          $or: [
            {
              email: { $regex: search, $options: 'i' },
            },
            {
              name: { $regex: search, $options: 'i' },
            },
          ],
        });

        return {
          users,
          count,
        };
      case 'getUserById':
        return await User.findById(args.id);
      case 'getUserByCognitoUserId':
        return await User.findOne({
          userId: args.userId,
        });
      case 'createUser':
        return await User.create({
          ...args,
          createdBy: identity.claims.sub,
        });
      case 'updateUserStatus':
        await adminToggleUserStatus(args.userId, args.status);
        return await User.findOneAndUpdate(
          {
            userId: args.userId,
          },
          {
            updatedBy: identity.claims.sub,
            active: args.status,
            updatedAt: new Date(),
          },
          {
            new: true,
            runValidators: true,
          }
        );
      case 'cancelUserSubscription':
        tempSubscription = {
          active: false,
          subscriptionType: null,
          description: null,
          amount: null,
          subscribedOn: null,
          expiringOn: null,
        };
        return await User.findOneAndUpdate(
          {
            userId: args.userId,
          },
          {
            subscription: tempSubscription,
            updatedBy: identity.claims.sub,
            updatedAt: new Date(),
          },
          {
            new: true,
            runValidators: false,
          }
        );
      case 'updateUser':
        return await User.findOneAndUpdate(
          {
            userId: args.userId,
          },
          { ...args, updatedAt: new Date() },
          {
            new: true,
            runValidators: true,
          }
        );
      default:
        throw new Error(
          'Something went wrong! Please check your resolver mapping template'
        );
    }
  } catch (error) {
    // console.log('error', error);
    const error2 = error;
    throw error2;
  }
};