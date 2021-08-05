import * as mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  body: String,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

export const Comment = mongoose.model("Comment", commentSchema);
