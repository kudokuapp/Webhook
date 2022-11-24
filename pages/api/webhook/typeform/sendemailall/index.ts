import type { NextApiRequest, NextApiResponse } from 'next';
import verifyHeader from '$utils/typeform/verifyheader';
import pool from '$utils/postgres';
import sgMail from '@sendgrid/mail';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event_type, form_response } = req.body;

  const answers = [...form_response.answers];

  const answer = {
    from: answers[0].choice.label,
    emailSubject: answers[1].text,
    emailText: answers[2].text,
    emailBody: answers[3].text,
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
          sender: answer.from,
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
  const queryString = 'SELECT * FROM users_final ORDER BY id ASC';

  const arr: any[] = [];

  return new Promise(function (resolve, reject) {
    pool.query(queryString, arr, (err, res) => {
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
  sender: 'Furqon' | 'Rizqy' | 'Aldi';
  subject: string;
  text: string;
}

async function sendEmail({
  email,
  firstName,
  kudos,
  htmlBody,
  sender,
  subject,
  text,
}: SendEmailData): Promise<sgMail.ClientResponse> {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

  let msg = {} as sgMail.MailDataRequired;

  switch (sender) {
    case 'Furqon':
      msg.to = email;
      msg.from = 'Furqon @ Kudoku <furqon@kudoku.id>';
      msg.subject = subject;
      msg.text = text;
      msg.html = `
            <p>Heyy ${firstName}👋🏼, Kudos No. ${kudos}!</p>
            <br />
            ${htmlBody}
            `;
      break;

    case 'Rizqy':
      msg.to = email;
      msg.from = 'Rizqy @ Kudoku <rizqy@kudoku.id>';
      msg.subject = subject;
      msg.text = text;
      msg.html = `
              <p>Halo ${firstName}, Kudos ${kudos}!</p>
              <br />
              ${htmlBody}
              `;
      break;

    case 'Aldi':
      msg.to = email;
      msg.from = 'Aldi @ Kudoku <aldi@kudoku.id>';
      msg.subject = subject;
      msg.text = text;
      msg.html = `
                <p>Hi ${firstName}, Kudos nomor ${kudos}!</p>
                <br />
                ${htmlBody}
                `;
      break;

    default:
      msg.to = email;
      msg.from = 'Furqon @ Kudoku <furqon@kudoku.id>';
      msg.subject = subject;
      msg.text = text;
      msg.html = `
              <p>Heyy ${firstName}👋🏼, Kudos No. ${kudos}!</p>
              <br />
              ${htmlBody}
              `;
      break;
  }

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
