import type { NextApiRequest, NextApiResponse } from 'next';
import verifyHeader from '$utils/typeform/verifyheader';
import bgstpool from '$utils/bgst';
import sgMail from '@sendgrid/mail';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event_type, form_response } = req.body;

  const answers = [...form_response.answers];

  const answer = {
    emailSubject: answers[0].text,
    emailText: answers[1].text,
    emailBody: answers[2].text,
  };

  const isValid = verifyHeader(req, event_type);

  if (isValid) {
    try {
      const response = await dbQuery();

      for (const kudos of response) {
        await sendEmail({
          email: kudos.email,
          firstName: kudos.firstname,
          kudos: kudos.id,
          htmlBody: answer.emailBody,
          subject: answer.emailSubject,
          text: answer.emailText,
        });
      }

      res.status(200).json({ message: 'Successfully send email to all kudos' });
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

async function dbQuery(): Promise<any> {
  const queryString = 'SELECT * FROM "User" ORDER BY id ASC';

  const arr: any[] = [];

  return new Promise(function (resolve, reject) {
    bgstpool.query(queryString, arr, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows);
      }
    });
  });
}

interface SendEmailData {
  email: string;
  firstName: string;
  kudos: number | string;
  htmlBody: string;
  subject: string;
  text: string;
}

async function sendEmail({
  email,
  firstName,
  kudos,
  htmlBody,
  subject,
  text,
}: SendEmailData): Promise<sgMail.ClientResponse> {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

  const msg = {
    to: email,
    from: 'Furqon @ Kudoku <furqon@kudoku.id>',
    subject,
    text,
    html: `
    <p>Heyy ${firstName}👋🏼, Kudos No. ${kudos}!</p>
    <br />
    ${htmlBody}
    `,
  } as sgMail.MailDataRequired;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const response = await sgMail.send(msg);
        resolve(response[0]);
      } catch (e) {
        const error = e as Error;
        reject(error);
      }
    })();
  });
}
