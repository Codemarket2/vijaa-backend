import { Schema, model } from 'mongoose';
import { ISchema, IMedia } from '../../utils/cutomTypes';
import { fieldSchema, IField } from '../../form/utils/formModel';
import { valueSchema, IValue } from '../../form/utils/responseModel';

export interface IListItem extends ISchema {
  title: string;
  slug: string;
  description: string;
  media: [IMedia];
  fields: [IField];
  active: boolean;
  values: [IValue];
}

const listItemSchema = new Schema<IListItem>(
  {
    types: [{ type: Schema.Types.ObjectId, ref: 'ListType' }],
    title: String,
    slug: { type: String, unique: true, required: true },
    description: String,
    media: {
      type: [{ url: String, caption: String }],
      default: [],
    },
    fields: { type: [fieldSchema], default: [] },
    values: { type: [valueSchema], default: [] },
    active: {
      type: Boolean,
      default: false,
    },
    authenticateUser: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Schema.Types.Mixed,
      default: { option: false },
    },
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

const ListItem = model<IListItem>('ListItem', listItemSchema);

export default ListItem;
