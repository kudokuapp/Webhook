import type { NextApiRequest, NextApiResponse } from 'next';
import verifyHeader from '$utils/typeform/verifyheader';
import bgstpool from '$utils/bgst';
import sgMail from '@sendgrid/mail';
import institutionIdToString from '$utils/helper/institutionIdToString';

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

    try {
      for (let i = 0; i < response.length; i++) {
        const element = response[i];

        const user = await userQuery(Number(element.kudosId));

        await sendEmail({
          email: user.email,
          firstName: user.firstName,
          kudosNo: user.id,
          account: institutionIdToString(element.institutionId),
        });
      }
      res
        .status(200)
        .json({ message: 'Successfully send email to all kudos (BGST)' });
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

async function dbQuery(): Promise<any> {
  const queryString =
    'SELECT * FROM "Account" WHERE expired=true ORDER BY id ASC';

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

async function userQuery(kudosId: number): Promise<any> {
  const query = 'SELECT * FROM "User" WHERE id=$1';

  const arr = [kudosId];

  return new Promise(function (resolve, reject) {
    bgstpool.query(query, arr, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rows[0]);
      }
    });
  });
}

async function sendEmail({
  email,
  firstName,
  kudosNo,
  account,
}: {
  email: string;
  firstName: string;
  kudosNo: number | string;
  account: string;
}): Promise<sgMail.ClientResponse> {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">

  <head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  </head>
  <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">❗️Ada akun Bank/E-Wallet kamu yang gabisa di BGST<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>

  <body style="background-color:#ffffff;color:#24292e;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;">
    <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;width:480px;margin:0 auto;padding:20px 0 48px">
      <tr style="width:100%">
        <td><img alt="BGST" src="https://drive.google.com/uc?id=1ePzW3lbfFIb2RlpnqMFyyv9QqlQHipYu" width="78" height="25" style="display:block;outline:none;border:none;text-decoration:none" />
          <p style="font-size:24px;line-height:1.25;margin:16px 0">❗️<strong>${firstName}</strong>, kamu butuh login kembali akun ${account} kamu ke BGST</p>
          <table style="padding:24px;border:solid 1px #dedede;border-radius:5px;text-align:center" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
            <tbody>
              <tr>
                <td>
                  <p style="font-size:14px;line-height:24px;margin:0 0 10px 0;text-align:left">Hey <strong>${firstName}, Kudos No. ${kudosNo}</strong>!</p>
                  <p style="font-size:14px;line-height:24px;margin:0 0 10px 0;text-align:left"><strong>Akun ${account} kamu perlu login kembali</strong> di BGST. Jangan khawatir, abis kamu login kembali, laporan bulanan kamu yang paling baru langsung siap buat kamu.</p><a href="https://bgst.kudoku.id/connect/${account
    .trim()
    .toLowerCase()}" target="_blank" style="font-size:14px;background-color:#2C5EA8;color:#fff;line-height:100%;border-radius:0.5em;padding:0px 0px;text-decoration:none;display:inline-block;max-width:100%"><span><!--[if mso]><i style="letter-spacing: undefinedpx;mso-font-width:-100%;mso-text-raise:0" hidden>&nbsp;</i><![endif]--></span><span style="font-size:14px;background-color:#2C5EA8;color:#fff;line-height:120%;border-radius:0.5em;padding:0.75em 1.5em;max-width:100%;display:inline-block;text-decoration:none;text-transform:none;mso-padding-alt:0px;mso-text-raise:0">Login kembali akun ${account}</span><span><!--[if mso]><i style="letter-spacing: undefinedpx;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
                </td>
              </tr>
            </tbody>
          </table>
          <p style="font-size:12px;line-height:24px;margin:16px 0;color:#6a737d;text-align:center;margin-top:60px">PT. Kudoku Finansial Indonesia</p>
        </td>
      </tr>
    </table>
  </body>

</html>`;

  const msg: sgMail.MailDataRequired = {
    to: email,
    from: 'Furqon @ Kudoku <furqon@kudoku.id>',
    subject: `Akun ${account} kamu butuh login kembali`,
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
