import type { NextApiRequest, NextApiResponse } from 'next';
import verifyHeader from '$utils/typeform/verifyheader';
import bgstpool from '$utils/bgst';
import sgMail from '@sendgrid/mail';
import moment from 'moment';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event_type, form_response } = req.body;

  const answers = [...form_response.answers];

  const choice = answers[0].choice.label;

  const isValid = verifyHeader(req, event_type);

  moment.updateLocale('id', null);

  const month = moment().subtract(1, 'M').format('MMMM YYYY');

  if (isValid && choice === 'YES') {
    try {
      // const response = await dbQuery();

      // for (const kudos of response) {
      //   await sendEmail({
      //     email: kudos.email,
      //     kudosNo: kudos.kudosId,
      //     month,
      //   });
      // }

      res
        .status(200)
        .json({ message: 'Successfully send email to all kudos (BGST)' });
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
  const queryString = 'SELECT * FROM "Account" ORDER BY id ASC';

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
