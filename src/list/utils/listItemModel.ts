import { Schema, model } from 'mongoose';
import { ISchema, IMedia } from '../../utils/cutomTypes';
import { fieldSchema, IField } from '../../form/utils/formModel';

export interface IListItem extends ISchema {
  title: string;
  slug: string;
  description: string;
  media: [IMedia];
  fields: [IField];
  active: boolean;
}

const listItemSchema = new Schema<IListItem>(
  {
    types: [{ type: Schema.Types.ObjectId, ref: 'ListType' }],
    title: { type: String, unique: true },
    slug: String,
    description: String,
    media: {
      type: [{ url: String, caption: String }],
      default: [],
    },
    fields: { type: [fieldSchema], default: [] },
    active: {
      type: Boolean,
      default: false,
    },
    authenticateUser: {
      type: Boolean,
      default: false,
    },
    layouts: {
      type: Schema.Types.Mixed,
      default: {},
    },
    // extra: [{ key: String, value: String }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

listItemSchema.index({ slug: 1 });

const ListItem = model<IListItem>('ListItem', listItemSchema);

export default ListItem;
