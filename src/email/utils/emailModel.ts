import { Schema, model } from 'mongoose';

interface IEmail {
  senderEmail: string;
  receiverEmail: string[];
  subject: string;
  body: string;
}

const emailSchema = new Schema<IEmail>(
  {
    senderEmail: String,
    receiverEmail: [String],
    subject: String,
    body: String,
  },
  { timestamps: true },
);

export const EmailModel = model<IEmail>('Email', emailSchema);
