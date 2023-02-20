import type { NextApiRequest, NextApiResponse } from 'next';
import verifyHeader from '$utils/typeform/verifyheader';
import bgstpool from '$utils/bgst';
import moment from 'moment';
import axios, { AxiosError } from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event_type, form_response } = req.body;

  const answers = [...form_response.answers];

  const choice = answers[0].choice.label;

  const isValid = verifyHeader(req, event_type);

  if (isValid && choice === 'YES') {
    const response = await dbQuery();

    for (const account of response) {
      await getAccountDetail(account.accessToken).catch(async (e) => {
        const error = e as AxiosError;

        if (error.response?.status === 401) {
          await updateQuery(account.id);
        }
      });
    }

    res.status(200).json({
      message: 'Successfully update all expiry of the brick accessToken',
    });
  } else {
    res
      .status(500)
      .json({ message: 'Unable to access this webhook (not valid)' });
  }
}

async function dbQuery(): Promise<any> {
  const queryString = 'SELECT * FROM "Account" ORDER BY id ASC;';

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

async function updateQuery(accountId: string | number): Promise<any> {
  const queryString = 'UPDATE "Account" SET "expired"=false WHERE "id"=$1';

  const arr = [accountId];

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

export async function getAccountDetail(accessToken: string) {
  const url = new URL('/v1/account/list', 'https://api.onebrick.io');

  const options = {
    method: 'GET',
    url: url.href,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { data },
        }: { data: { data: any } } = await axios.request(options);

        resolve(data);
      } catch (e) {
        reject(e);
      }
    })();
  });
}
