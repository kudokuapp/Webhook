import type { NextApiRequest, NextApiResponse } from 'next';
import verifyHeader from '$utils/typeform/verifyheader';
import { Client } from '@notionhq/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event_type, form_response } = req.body;

  const id = form_response.answers[0].number as number;

  const isValid = verifyHeader(req, event_type);

  if (isValid) {
    try {
      const notionObj = await notionSearch(id);
      const pageId = notionObj[0].id;
      const response = await notionUpdateStatus(pageId);
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

async function notionSearch(id: number | string) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY_KUDOS });

  const { results } = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_KUDOS_ID as string,
    filter: {
      property: 'id',
      title: {
        equals: `${id}`,
      },
    },
  });

  return results;
}

async function notionUpdateStatus(pageId: string) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY_KUDOS });

  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      invited: {
        select: {
          name: 'true',
        },
      },
    },
  });

  return response;
}
