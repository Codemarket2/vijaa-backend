/* eslint-disable no-case-declarations */
import { DB } from "../utils/DB";
import { User } from "./utils/userModel";
import { adminToggleUserStatus } from "./utils/helper";
import { AppSyncEvent } from "../utils/cutomTypes";
import { getCurretnUser } from "../utils/authentication";
import produce from "immer";

export const handler = async (event: AppSyncEvent): Promise<any> => {
  try {
    await DB();
    const { fieldName } = event.info;
    const { arguments: args, identity } = event;
    const tempFilter: any = {};
    let tempSubscription = {};
    let users: any = [];
    let count = 0;
    let userProfile;

    const selectFromItem = "title";
    const populateFields = [
      {
        path: "userProfile.cancerType",
        select: selectFromItem,
      },
      {
        path: "userProfile.doctors",
        select: selectFromItem,
      },
      {
        path: "userProfile.symptoms",
        select: selectFromItem,
      },
    ];

    const authUser = await getCurretnUser(identity);

    switch (fieldName) {
      case "getUsers":
        const {
          page = 1,
          limit = 10,
          search = "",
          lowerRange = null,
          higherRange = null,
          sortBy = "-createdAtDate",
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
              email: { $regex: search, $options: "i" },
            },
            {
              name: { $regex: search, $options: "i" },
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
              email: { $regex: search, $options: "i" },
            },
            {
              name: { $regex: search, $options: "i" },
            },
          ],
        });

        return {
          users,
          count,
        };
      case "getUser":
        return await User.findById(args._id);
      case "getUserProfile":
        return await User.findOne({
          // userId: args.userId,
          userId: identity.claims.sub,
        }).populate(populateFields);
      case "getAbout":
        return await User.findOne({
          userId: identity.claims.sub,
        });
      case "getUserByCognitoUserId":
        return await User.findOne({
          userId: args.userId,
        });
      case "createUser":
        return await User.create({
          ...args,
          createdBy: authUser._id,
        });
      case "updateUserStatus":
        await adminToggleUserStatus(args.userId, args.status);
        return await User.findOneAndUpdate(
          {
            userId: args.userId,
          },
          {
            updatedBy: authUser._id,
            active: args.status,
            updatedAt: new Date(),
          },
          {
            new: true,
            runValidators: true,
          }
        );
      case "cancelUserSubscription":
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
      case "updateUser":
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

      case "createAbout":
        return await User.findOneAndUpdate(
          {
            userId: identity.claims.sub,
          },
          { ...args, updatedAt: new Date() },
          {
            new: true,
            runValidators: true,
          }
        );

      case "updateUserProfile":
        userProfile = await User.findOne(authUser._id);
        userProfile = {
          ...userProfile,
          [args.field]: [...userProfile[args.field], args.itemId],
        };

        return await User.findByIdAndUpdate(userProfile._id, {
          userProfile,
        });

      default:
        throw new Error(
          "Something went wrong! Please check your resolver mapping template"
        );
    }
  } catch (error) {
    // console.log('error', error);
    const error2 = error;
    throw error2;
  }
};

// case "updateUserProfile":
//   return await User.findByIdAndUpdate(
//     identity.claims["custom:_id"],
//     { ...args, updatedAt: new Date() },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
