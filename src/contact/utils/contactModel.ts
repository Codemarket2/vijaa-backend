import { Schema, model } from 'mongoose';

interface IContact {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  extraField: [{ fieldName: string; fieldValue: string }];
}

const contactSchema = new Schema<IContact>(
  {
    title: {
      type: String,
    },
    extraField: [
      {
        fieldName: String,
        fieldValue: String,
      },
    ],
    phone: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const ContactModel = model<IContact>('Contact', contactSchema);
export default ContactModel;
