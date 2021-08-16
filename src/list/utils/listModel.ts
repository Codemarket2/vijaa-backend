import * as mongoose from 'mongoose';

const listItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  active: {
    type: Boolean,
    default: true,
  },
  media: {
    type: [{ url: String, caption: String }],
    default: [],
  },
});

const listSchema = new mongoose.Schema({
  cancerTypes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ListItem',
  },
  name: String,
  active: {
    type: Boolean,
    default: true,
  },
  inUse: {
    type: Boolean,
    default: false,
  },
  createdBy: String,
  updatedBy: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
  items: [listItemSchema],
});

export const List = mongoose.model('List', listSchema);
