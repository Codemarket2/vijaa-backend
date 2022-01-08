import axios from 'axios';
import gql from 'graphql-tag';
import graphql from 'graphql';
import { sendPushNotification } from '../../utils/onesignal';
import { NotificationModel } from './notificationSchema';
import { User } from '../../user/utils/userModel';
import { sendEmail } from '../../utils/email';

const notificationMuattion = gql`
  mutation MyMutation($userId: ID!, $title: String!, $description: String, $link: String) {
    sendNotification(userId: $userId, title: $title, description: $description, link: $link) {
      userId
      title
      description
      link
    }
  }
`;

const { GRAPHQL_API_URL = '', GRAPHQL_API_KEY = '' } = process.env;

type payload = {
  userId: string;
  title: string;
  description?: string;
  link?: string;
};

export const sendNotification = async (payload: payload) => {
  if (GRAPHQL_API_URL && GRAPHQL_API_KEY) {
    await axios({
      url: GRAPHQL_API_URL,
      method: 'post',
      headers: {
        'x-api-key': GRAPHQL_API_KEY,
      },
      data: {
        query: graphql.print(notificationMuattion),
        variables: payload,
      },
    });

    const pushPayload = {
      title: payload.title,
      message: payload.description,
      userIds: [`${payload.userId}`],
    };

    const user = await User.findById(payload.userId);
    const emailBody = `
      Dear ${user.name}
    
      ${payload.description}.
    `;

    const emailPayload = {
      from: process.env.SENDER_EMAIL || 'info@boossti.com',
      to: [user.email],
      body: emailBody,
      subject: `New Response on ${payload.title}`,
    };
    try {
      const notification = await NotificationModel.create(payload);
      sendEmail(emailPayload)
        .then(() => console.log('Email Send!'))
        .catch((e) => console.log(e.message));
      await sendPushNotification(pushPayload);
    } catch (error) {
      console.log(error.message);
    }
  }
};
