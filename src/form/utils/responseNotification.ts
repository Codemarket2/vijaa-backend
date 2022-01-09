import { sendNotification } from '../../notification/utils/sendNotification';
import { sendEmail } from '../../utils/email';

export const sendResponseNotification = async (form: any, response: any) => {
  const { createdBy } = form;
  let submitedBy = '';
  if (response?.createdBy?.name) {
    submitedBy = response?.createdBy?.name;
  }
  const desc = response?.parentId?.title
    ? `${submitedBy} has submitted a new response on ${form?.name} From ${response?.parentId?.title} Page.`
    : `${submitedBy} has submitted a new response on ${form?.name}`;

  const payload = {
    userId: createdBy,
    title: form.name,
    description: desc,
    link: `/response/${response?._id}`,
  };

  if (form.name === 'Send Email Form') {
    sendEmailToSelectedUser(form, response);
  } else await sendNotification(payload);
};
const sendEmailToSelectedUser = (form: any, response: any) => {
  const { fields } = form;
  const { values } = response;
  const emails = values.filter((d) => d.field == fields[0]._id).map((d) => d.value);
  const subject = values.filter((d) => d.field == fields[1]._id)[0].value;
  const message = values.filter((d) => d.field == fields[2]._id)[0].value;

  const { SENDER_EMAIL = '' } = process.env;

  const emailPayload = {
    from: SENDER_EMAIL,
    to: emails,
    body: message,
    subject: subject,
  };
  sendEmail(emailPayload)
    .then(() => console.log('Email Send!'))
    .catch((e) => console.log(e.message));
};
