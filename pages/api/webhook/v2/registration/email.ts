import type { NextApiRequest, NextApiResponse } from 'next';
import getKudosNumber from '$database/getkudosnumber';
import verifyHeader from '$utils/typeform/verifyheader';
import { upperCaseEveryLetter } from '$utils/helper/datacleaning';
import { getTodayShort } from '$utils/helper/gettoday';
import sgMail from '@sendgrid/mail';

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
      const response = await sendRegistrationEmail(data);
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

async function sendRegistrationEmail({
  id,
  firstName,
  email,
}: KudosData): Promise<sgMail.ClientResponse> {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html lang="en">
  
    <head>
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    </head>
    <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Kamu sudah jadi Kudos🎉<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
    </div>
  
    <body style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,&quot;Helvetica Neue&quot;,Ubuntu,sans-serif">
      <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin:0 auto;padding:10px 0 48px;margin-bottom:64px">
        <tr style="width:100%">
          <td>
            <p style="font-size:16px;line-height:auto;margin:16px 0;text-align:left">Heyy ${firstName}, </p>
            <p style="font-size:16px;line-height:auto;margin:16px 0;text-align:left">Kenalin, gua Furqon, founder Kudoku.</p>
            <p style="font-size:16px;line-height:auto;margin:16px 0;text-align:left">Terima kasih banget udah ikutan Kudoku waiting list!</p>
            <table style="margin-top:10px;margin-bottom:10px;text-align:center" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:32px;line-height:auto;margin:16px 0;text-align:center">📣 Kamu officially Kudos No. <strong>${id}</strong>! 🥳 🎉</p><img alt="Stromtrooper Dancing" src="https://drive.google.com/uc?id=12usPcokGvrhNyRoHdcVX60qTbR0Htesd" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" />
                  </td>
                </tr>
              </tbody>
            </table>
            <p style="font-size:16px;line-height:auto;margin:16px 0;text-align:left">Kalo lo punya temen/siapapun yang kira-kira suka banget sama Kudoku, boleh tolong kasih tau dia ya hehe.</p>
            <p style="font-size:16px;line-height:auto;margin:16px 0;text-align:left">Tapi gua penasaran apa yang buat lo daftar? Feel free to reply this email and talk with me :)</p>
            <p style="font-size:16px;line-height:auto;margin:16px 0;text-align:left">Hope you have a sunny day Kudos 🌞!</p>
          </td>
        </tr>
      </table>
    </body>
  
  </html>`;

  const msg = {
    to: email,
    from: 'Furqon @ Kudoku <furqon@kudoku.id>',
    subject: 'Terima kasih sudah ikut waitlist 🤩',
    html,
  };

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const response = await sgMail.send(msg);
        resolve(response[0]);
      } catch (e) {
        const error = e as Error;
        reject(error);
      }
    })();
  });
}
