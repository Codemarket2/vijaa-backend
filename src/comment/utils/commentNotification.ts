import FieldValueModel from '../../field/utils/fieldValueModel';
import { Comment } from './commentModel';
import { sendNotification } from '../../notification/utils/sendNotification';
import { Post } from '../../post/utils/postModel';

export const sendCommentNotification = async (comment) => {
  const fieldValue = await FieldValueModel.findById(comment.threadId);
  if (fieldValue && fieldValue?.createdBy.toString() !== comment.createdBy?._id.toString()) {
    const payload = {
      userId: `${fieldValue.createdBy}`,
      title: 'New Comment',
      description: `${comment.createdBy?.name} commented on your post`,
      // link: `/response/${responseId}`,
    };
    await sendNotification(payload);
  }
  if (comment.threadId.toString() !== comment.parentId.toString()) {
    const parentComment = await Comment.findById(comment.parentId);
    if (
      parentComment &&
      parentComment?.createdBy.toString() !== comment.createdBy?._id.toString()
    ) {
      const payload = {
        userId: `${parentComment.createdBy}`,
        title: 'New Comment',
        description: `${comment.createdBy?.name} replied to your comment`,
        // link: `/response/${responseId}`,
      };
      await sendNotification(payload);
    }
  }
  try {
    const post = await Post.findById(comment.parentId);

    if (post?.createdBy?.toString() !== comment?.createdBy?._id.toString()) {
      const parentComment = await Comment.findById(comment.parentId);
      if (
        parentComment &&
        parentComment?.createdBy.toString() !== comment?.createdBy?._id.toString()
      ) {
        const payload = {
          userId: `${parentComment?.createdBy}`,
          title: `New Reply on your comment.`,
          description: `${comment?.createdBy?.name} replied to your comment`,
          link: `/comment/${parentComment?._id}`,
          threadId: parentComment?.threadId,
        };
        await sendNotification(payload);
      }
      if (!parentComment) {
        const payload = {
          userId: `${post?.createdBy?._id}`,
          title: 'New Comment on Your Post',
          description: `${comment?.createdBy?.name} commented on your post`,
          link: `/comment/${comment?._id}`,
          threadId: comment?.threadId,
        };
        await sendNotification(payload);
      }
    }
  } catch (e) {
    console.log(e.message);
  }
};
