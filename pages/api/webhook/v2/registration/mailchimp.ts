import mailchimp, { AddListMemberBody } from '@mailchimp/mailchimp_marketing';
import type { NextApiRequest, NextApiResponse } from 'next';
import getKudosNumber from '$database/getkudosnumber';
import verifyHeader from '$utils/typeform/verifyheader';
import { upperCaseEveryLetter } from '$utils/helper/datacleaning';
import { getTodayShort } from '$utils/helper/gettoday';

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
    email: `${hiddenAnswers.email.trim()}`.trim(),
    wa: `${answers[2].phone_number}`,
    registerDate: getTodayShort(),
    invited: false,
    subscribe: true,
  };

  if (isValid) {
    try {
      const response = await sendMailChimp(data);
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

async function sendMailChimp({
  id,
  firstName,
  lastName,
  email,
  wa,
  subscribe,
}: KudosData): Promise<
  mailchimp.MembersSuccessResponse | mailchimp.MemberErrorResponse
> {
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY as string,
    server: process.env.MAILCHIMP_SERVER_PREFIX as string,
  });

  const data: AddListMemberBody = {
    email_address: email,
    status: subscribe ? 'subscribed' : 'unsubscribed',
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
      PHONE: wa,
      ID: id,
    },
  };

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const response = await mailchimp.lists.addListMember(
          process.env.MAILCHIMP_LISTS_ID as string,
          data
        );
        resolve(response);
      } catch (e) {
        reject(e);
      }
    })();
  });
}
