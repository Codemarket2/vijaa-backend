import { Schema, model } from 'mongoose';

interface IEmail {
  senderEmail: string;
  receiverEmail: string[];
  subject: string;
  body: string;
}

const emailSchema = new Schema<IEmail>(
  {
    senderEmail: {
      type: String,
      required: true,
    },
    receiverEmail: [
      {
        type: String,
        required: true,
      },
    ],
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export const EmailModel = model<IEmail>('Email', emailSchema);
