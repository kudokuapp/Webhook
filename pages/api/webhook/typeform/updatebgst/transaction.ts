import type { NextApiRequest, NextApiResponse } from 'next';
import verifyHeader from '$utils/typeform/verifyheader';
import bgstpool from '$utils/bgst';
import moment from 'moment';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event_type, form_response } = req.body;

  const answers = [...form_response.answers];

  const choice = answers[0].choice.label;

  const isValid = verifyHeader(req, event_type);

  if (isValid && choice === 'YES') {
    try {
      const response = await dbQuery();

      for (const kudos of response) {
        await updateTransaction({
          accessToken: kudos.accessToken,
        });
      }

      res
        .status(200)
        .json({ message: 'Successfully update all accounts of BGST' });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ ...error });
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

async function updateTransaction({ accessToken }: { accessToken: string }) {
  const from = moment().subtract(1, 'M').startOf('M').format('YYYY-MM-DD');

  const to = moment().subtract(1, 'M').endOf('M').format('YYYY-MM-DD');

  const url = new URL('/v1/transaction/list', 'https://api.onebrick.io');

  const options = {
    method: 'GET',
    url: url.href,
    params: { from, to },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return new Promise(async (resolve, reject) => {
    try {
      const {
        data: { data },
      }: { data: { data: any } } = await axios.request(options);

      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}
