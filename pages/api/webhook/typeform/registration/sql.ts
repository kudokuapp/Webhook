import type { NextApiRequest, NextApiResponse } from 'next';
import getKudosNumber from '$database/getkudosnumber';
import verifyHeader from '$utils/typeform/verifyheader';
import { upperCaseEveryLetter } from '$utils/helper/datacleaning';
import { getTodayShort } from '$utils/helper/gettoday';
import pool from '$utils/postgres';
import { renderSource } from '$utils/typeform/rendersource';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event_type, form_response } = req.body;
  const answers = [...form_response.answers];
  const hiddenAnswers = { ...form_response.hidden };

  const isValid = verifyHeader(req, event_type);

  const data: KudosData = {
    id: await getKudosNumber(),
    parentId: hiddenAnswers.parentId
      ? (hiddenAnswers.parentId as number)
      : null,
    firstName: upperCaseEveryLetter(`${answers[0].text}`),
    lastName: upperCaseEveryLetter(`${answers[1].text}`),
    email: `${answers[2].email}`,
    wa: `+${hiddenAnswers.wa.trim()}`.trim(),
    registerDate: getTodayShort(),
    invited: false,
    subscribe: true,
    source: renderSource(Number(hiddenAnswers.index)),
  };

  if (isValid) {
    try {
      const response = await dbQuery(data);
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

async function dbQuery({
  id,
  parentId,
  firstName,
  lastName,
  email,
  wa,
  registerDate,
  invited,
  source,
  subscribe,
}: KudosData) {
  const query =
    'INSERT INTO users_final (id, firstname, lastname, email, whatsapp, registerdate, invited, parentid, source, subscribe) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';

  const arr = [
    id,
    firstName,
    lastName,
    email,
    wa,
    registerDate,
    invited,
    parentId,
    source,
    subscribe,
  ];

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
