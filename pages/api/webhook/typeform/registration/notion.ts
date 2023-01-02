import type { NextApiRequest, NextApiResponse } from 'next';
import getKudosNumber from '$database/getkudosnumber';
import verifyHeader from '$utils/typeform/verifyheader';
import { upperCaseEveryLetter } from '$utils/helper/datacleaning';
import { getTodayShort } from '$utils/helper/gettoday';
import { Client } from '@notionhq/client';
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
      const response = await notionQuery(data);
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

async function notionQuery({
  id,
  firstName,
  lastName,
  email,
  wa,
  registerDate,
  invited,
  source,
}: KudosData) {
  const notion = new Client({
    auth: process.env.NOTION_API_KEY_KUDOS as string,
  });

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const response = await notion.pages.create({
          parent: {
            database_id: process.env.NOTION_DATABASE_KUDOS_ID as string,
          },
          properties: {
            id: {
              title: [
                {
                  type: 'text',
                  text: {
                    content: `${id}`,
                  },
                },
              ],
            },
            firstname: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: firstName,
                  },
                },
              ],
            },
            lastname: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: lastName,
                  },
                },
              ],
            },
            email: {
              email: email,
            },
            whatsapp: {
              phone_number: wa,
            },
            invited: {
              select: {
                name: `${invited}`,
              },
            },
            source: {
              select: {
                name: `${source}`,
              },
            },
            registerdate: {
              date: {
                start: `${registerDate}`,
              },
            },
          },
        });
        resolve(response);
      } catch (e) {
        reject(e);
      }
    })();
  });
}
