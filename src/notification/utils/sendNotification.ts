import axios from 'axios';
import gql from 'graphql-tag';
import graphql from 'graphql';

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
  }
};