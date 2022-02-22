import { model, Schema } from 'mongoose';
import { valueSchema } from '../../form/utils/responseModel';
import { ISchema } from '../../utils/cutomTypes';

export interface IValue {
  field: string;
  value: string;
  valueNumber: number;
  valueBoolean: boolean;
  valueDate: Date;
  itemId: string;
  values: [string];
}
export interface IResponse extends ISchema {
  values: [IValue];
}

export const contactSchema = new Schema<IResponse>(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'ListItem',
    },
    values: [valueSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);
const ContactModel = model<IResponse>('Contact', contactSchema);
export default ContactModel;
