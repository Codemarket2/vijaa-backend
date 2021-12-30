import * as https from 'https';

interface IPayload {
  title: string;
  message?: string;
  userIds: string[];
}

export const sendPushNotification = function (payload: IPayload) {
  const data = {
    app_id: 'd7a822b5-a821-460f-a60a-86d08d19e8f0', //production
    // app_id: '7f0f54e4-44c9-44a1-a143-452fcef5ef9b', //dev
    headings: { en: payload.title },
    contents: { en: payload.message },
    channel_for_external_user_ids: 'push',
    include_external_user_ids: payload.userIds,
  };
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    host: 'onesignal.com',
    Authorization: 'Basic MmNkMGI5M2EtZTcwMC00YTcxLTlhZTUtZjZhNzA3NDI1Y2Qx', //production
    // Authorization: 'Basic OTRlYzQwYmEtYWFlNy00YWVmLThhZjktYWQxYTk1NzU5MTQy', //dev
  };

  const options = {
    host: 'onesignal.com',
    port: 443,
    path: '/api/v1/notifications',
    method: 'POST',
    headers: headers,
  };

  return new Promise((resolve, reject) => {
    /*
    const req = https.request(options, function (res) {
      res.setEncoding('utf8');

      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      console.log(res);

      res.on('end', () => {
        resolve(true);
      });
    });

    req.on('error', function (e) {
      reject(e);
    });

    req.write(JSON.stringify(data));
    req.end();
    */
    const req = https.request(options, function (res) {
      res.on('data', function (data) {
        console.log('Response:');
        console.log(JSON.parse(data));
        resolve(true);
      });
    });
    req.on('error', function (e) {
      console.log('ERROR:');
      console.log(e);
      reject(e);
    });

    req.write(JSON.stringify(data));
    req.end();
  });
};

// sendPushNotification({
//   title: 'Notification From Console',
//   message:
//     "This Notification is for testing purpose and it is triggred by Developer. you don't have to worry about this notification. Have a nice day.",
//   userIds: ['61b2fc00b5a1100008288486', '61cb0b5fb2c3d30009278768', '61cc415c01e46b0008a10027'],
// })
//   .then((data) => console.log({ data }))
//   .catch((e) => console.log(e));
