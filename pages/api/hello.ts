import type { NextApiRequest, NextApiResponse } from 'next';
import mailchimp from '@mailchimp/mailchimp_marketing';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await setMailchimp('fathurrazanq@gmail.com', false);
  res.status(200).json(response);
}

async function setMailchimp(email: string, subscribe: boolean) {
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY as string,
    server: process.env.MAILCHIMP_SERVER_PREFIX as string,
  });

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const response = await mailchimp.lists.setListMember(
          process.env.MAILCHIMP_LISTS_ID as string,
          email,
          {
            email_address: email,
            status_if_new: subscribe ? 'subscribed' : 'unsubscribed',
            status: subscribe ? 'subscribed' : 'unsubscribed',
          }
        );
        resolve(response);
      } catch (e) {
        reject(e);
      }
    })();
  });
}
