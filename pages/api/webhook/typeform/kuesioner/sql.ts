import type { NextApiRequest, NextApiResponse } from 'next';
import verifyHeader from '$utils/typeform/verifyheader';
import pool from '$utils/postgres';

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
      const response = await dbQuery(email, subscribe);
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

async function dbQuery(email: string, subscribe: boolean) {
  const query = 'UPDATE users_final SET subscribe=$2 WHERE email=$1';

  const arr = [email, subscribe];

  return new Promise(function (resolve, reject) {
    pool.query(query, arr, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
