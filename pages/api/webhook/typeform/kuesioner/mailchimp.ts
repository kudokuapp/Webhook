import type { NextApiRequest, NextApiResponse } from 'next';
import mailchimp from '@mailchimp/mailchimp_marketing';
import verifyHeader from '$utils/typeform/verifyheader';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event_type, form_response } = req.body;
  const answers = [...form_response.answers];
  const hiddenAnswers = { ...form_response.hidden };

  const isValid = verifyHeader(req, event_type);

  const email = hiddenAnswers.email;
  const subscribe = answers[10].choice.label === 'Ya' ? true : false;

  if (isValid) {
    try {
      const response = await setMailchimp(email, subscribe);
      res.status(200).json(response);
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ error: error.message });
    }
  } else {
    res
      .status(500)
      .json({ message: 'Unable to access this webhook (not valid)' });
  }
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
