import type { NextApiRequest, NextApiResponse } from 'next';
import verifyHeader from '$utils/typeform/verifyheader';
import pool from '$utils/postgres';
import { MongoClient } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event_type, form_response } = req.body;

  const idForm = `${form_response.answers[0].number}`;

  const isValid = verifyHeader(req, event_type);

  const uri = process.env.MONGODB_DATABASE_URL as string;
  const client = new MongoClient(uri);

  if (isValid) {
    try {
      const database = client.db('appdb');
      const user = database.collection('User');

      const data = await dbQuery(idForm);
      const query = {
        username: '',
        password: '',
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        whatsapp: data.whatsapp,
        kudosNo: Number(data.id),
      };

      //Avoid duplication in the app
      const existingUser = await user.findOne({ email: query.email });

      if (existingUser) {
        throw new Error('user already exist');
      }

      const response = await user.insertOne(query);

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

async function dbQuery(id: number | string): Promise<any> {
  const queryString = 'SELECT * FROM users_final WHERE id=$1';

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
