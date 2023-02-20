import type { NextApiRequest, NextApiResponse } from 'next';
import verifyHeader from '$utils/typeform/verifyheader';
import bgstpool from '$utils/bgst';
import sgMail from '@sendgrid/mail';
import moment from 'moment';
import _ from 'lodash';
import institutionIdToString from '$utils/helper/institutionIdToString';

interface LodashGroupByKudosId {
  id: number;
  createdAt: Date | string;
  institutionId: number;
  accessToken: string;
  accountNumber: string;
  brick_account_id: string;
  kudosId: number;
  expired: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event_type, form_response } = req.body;

  const answers = [...form_response.answers];

  const choice = answers[0].choice.label;

  const isValid = verifyHeader(req, event_type);

  moment.updateLocale('id', null);

  const month = moment().subtract(1, 'M').format('MMMM YYYY');

  if (isValid && choice === 'YES') {
    const response = await dbQuery();

    const groupByKudosId = _.groupBy(response, ({ kudosId }) => {
      return kudosId;
    });

    const iteratee = Object.keys(groupByKudosId);

    try {
      for (let i = 0; i < iteratee.length; i++) {
        const kudosId = iteratee[i];

        const element = groupByKudosId[kudosId];

        const user = await userQuery(Number(kudosId));

        await sendEmail({
          email: user.email,
          firstName: user.firstName,
          kudosNo: kudosId,
          month,
          array: element,
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
    'SELECT * FROM "Account" WHERE expired=false ORDER BY id ASC';

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
  month,
  array,
}: {
  email: string;
  firstName: string;
  kudosNo: number | string;
  month: string;
  array: LodashGroupByKudosId[];
}): Promise<sgMail.ClientResponse> {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">

  <head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  </head>
  <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Laporan BGST kamu udah siap!<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>

  <body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,&quot;Helvetica Neue&quot;,Ubuntu,sans-serif">
    <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px">
      <tr style="width:100%">
        <td>
          <table style="padding:0 48px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
            <tbody>
              <tr>
                <td><img alt="BGST" src="https://drive.google.com/uc?id=1ePzW3lbfFIb2RlpnqMFyyv9QqlQHipYu" width="78" height="25" style="display:block;outline:none;border:none;text-decoration:none" />
                  <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                  <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Heyy ${firstName}, Kudos No. ${kudosNo}!</p>
                  <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Laporan BGST kamu bulan <strong>${month}</strong> udah tersedia nih.</p>
                  <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Akun Bank/E-Wallet yang sudah kamu <em>connect</em> ke BGST dan sudah tersedia laporannya itu ada:
                  <ol style="color:#525f7f;font-size:16px;line-height:24px;text-align:left">
                    ${array.map((val) => {
                      return `<li>${institutionIdToString(
                        val.institutionId
                      )}</li>`;
                    })}
                  </ol>
                  </p>
                  <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Penasaran kan bulan January 2023 kamu gimana? Yuk buruan cek BGST sekarang!</p><a href="https://bgst.kudoku.id/t" target="_blank" style="background-color:#2C5EA8;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;text-align:center;display:inline-block;width:100%;p-x:10px;p-y:10px;line-height:100%;max-width:100%;padding:10px 10px"><span><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%;mso-text-raise:15" hidden>&nbsp;</i><![endif]--></span><span style="background-color:#2C5EA8;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;text-align:center;display:inline-block;width:100%;p-x:10px;p-y:10px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:7.5px">Cek laporan BGST</span><span><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
                  <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                  <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Kalo ada bug, error, atau feature request, jangan sungkan-sungkan untuk email balik ke gua yaa. Tinggal reply aja email ini pasti gua bales!</p>
                  <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">- Furqon</p>
                  <p style="font-size:12px;line-height:16px;margin:16px 0;color:#8898aa">PT. Kudoku Finansial Indonesia</p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>
  </body>

</html>`;

  const msg: sgMail.MailDataRequired = {
    to: email,
    from: 'Furqon @ Kudoku <furqon@kudoku.id>',
    subject: `BGST kamu bulan ${month}`,
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
