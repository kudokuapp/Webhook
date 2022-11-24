import type { NextApiRequest, NextApiResponse } from 'next';
import verifyHeader from '$utils/typeform/verifyheader';
import pool from '$utils/postgres';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event_type, form_response } = req.body;

  const id = form_response.answers[0].number as number;

  const isValid = verifyHeader(req, event_type);

  if (isValid) {
    try {
      const response = await dbQuery(id);
      res.status(200).json({ message: 'Successfully update kudos', response });
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

async function dbQuery(id: number | string): Promise<any> {
  const queryString = 'UPDATE users_final SET invited=true WHERE id=$1';

  const arr = [id];

  return new Promise(function (resolve, reject) {
    pool.query(queryString, arr, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows[0]);
      }
    });
  });
}
