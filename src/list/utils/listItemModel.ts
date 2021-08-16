import { Schema, model, Model, Document } from 'mongoose';

export interface IListItem extends Document {
  title: string;
  description: string;
  media: [{ url: string; caption: string }];
  active: boolean;
  extra?: [{ key: string; value: string }];
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ListItemSchema: Schema = new Schema(
  {
    types: [{ type: Schema.Types.ObjectId, ref: 'ListType' }],
    title: String,
    description: String,
    media: {
      type: [{ url: String, caption: String }],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
    extra: [{ key: String, value: String }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const ListItem: Model<IListItem> = model('ListItem', ListItemSchema);

export default ListItem;
