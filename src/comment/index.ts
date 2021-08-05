import { DB } from "../utils/DB";
import { getCurretnUser } from "../utils/authentication";
import { AppSyncEvent } from "../utils/cutomTypes";
import { User } from "../user/utils/userModel";
import { Comment } from "./utils/commentModel";

export const handler = async (event: AppSyncEvent): Promise<any> => {
  try {
    await DB();
    const { fieldName } = event.info;
    const { arguments: args, identity } = event;
    const user = await getCurretnUser(identity);
    let tempComment: any;

    switch (fieldName) {
      case "createComment": {
        return await Comment.create({
          ...args,
          createdBy: user._id,
        });
      }
      case "getComment": {
        return await Comment.findById(args._id);
      }

      case "getComments": {
        return await Comment.find({});
      }
      case "updateComment": {
        tempComment = await Comment.findOneAndUpdate(
          { _id: args._id, createdBy: user._id },
          { ...args, updatedAt: new Date(), updatedBy: user._id },
          {
            new: true,
            runValidators: true,
          }
        );
        return {
          ...tempComment.toJSON(),
          createdBy: user,
        };
      }
      case "deleteComment": {
        await Comment.findOneAndDelete({ _id: args._id, createdBy: user._id });
        return true;
      }
      default:
        throw new Error(
          "Something went wrong! Please check your Query or Mutation"
        );
    }
  } catch (error) {
    const error2 = error;
    throw error2;
  }
};
