import { Schema, model } from 'mongoose';

// first name, last name, email, phone#, businessName, title

interface IContact {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  mailingListName: string;
  extraField: [{ fieldName: string; fieldValue: string }];
}

const contactSchema = new Schema<IContact>(
  {
    mailingListName: {
      type: String,
      required: true,
    },
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
