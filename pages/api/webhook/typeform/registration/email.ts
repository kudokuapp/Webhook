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
    email: `${answers[2].email}`,
    wa: `+${hiddenAnswers.wa.trim()}`.trim(),
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
  lastName,
  email,
  wa,
}: KudosData): Promise<sgMail.ClientResponse> {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

  const DISCORD = 'https://discord.gg/S9TVVv5YU3';
  const FORMLINK = `https://kudoku.typeform.com/to/XcJ2iwfQ#firstname=${firstName}&lastname=${lastName}&email=${email}&wa=${wa}&index=1`;

  const html = `
<div
  style="
    box-sizing: inherit;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    max-width: 700px;
    margin: 0 auto;
  "
>
  <div
    style="
      box-sizing: inherit;
      font-family: Avenir, Helvetica, Arial, sans-serif;
    "
    align="center"
  >
    <a
      href="https://kudoku.id"
      style="
        background-color: transparent;
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        color: #4183c4;
        text-decoration: none;
      "
      rel="nofollow"
    >
      <img
        alt="Kudoku Logo"
        src="https://drive.google.com/uc?id=1pJH21GQufDoJu88E4TfrPu5GyjAh3X-l"
        style="
          border: none;
          border-style: none;
          box-sizing: inherit;
          font-family: Avenir, Helvetica, Arial, sans-serif;
          width: 200px;
        "
      />
    </a>
  </div>

  <div
    style="
      box-sizing: inherit;
      font-family: Avenir, Helvetica, Arial, sans-serif;
      border-radius: 4px;
      font-size: 1rem;
      line-height: 1.5;
      position: relative;
      margin: 1rem 0em;
      padding: 1.5em;
      border: 1px solid #c0c0c0;
    "
  >
    <p
      style="
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.4285em;
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.87);
        margin: 0 0 1em;
      "
    >
      Heyy ${firstName}👋🏼,
    </p>

    <p
      style="
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.4285em;
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.87);
        margin: 0 0 1em;
      "
    >
      Kenalin, gua Furqon, founder Kudoku.
    </p>

    <p
      style="
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.4285em;
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.87);
        margin: 0 0 1em;
      "
    >
      Terima kasih banget udah ikutan
      <strong
        style="
          font-weight: bolder;
          box-sizing: inherit;
          font-family: Avenir, Helvetica, Arial, sans-serif;
        "
        >Kudoku</strong
      >
      waiting list!
    </p>

    <h1
      style="
        font-size: 1.71428571rem;
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.28571429em;
        margin: -0.14285714em 0 0.83em;
        padding: 0;
      "
      align="center"
    >
      📣 You're officially a Kudos No. ${id}! 🥳 🎉
    </h1>

    <p
      style="
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.4285em;
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.87);
        margin: 0 0 1em;
      "
    >
      Kalo lo punya temen/siapapun yang kira-kira suka banget sama Kudoku, boleh
      tolong kasih tau dia ya hehe.
    </p>

    <p
      style="
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.4285em;
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.87);
        margin: 0 0 1em;
      "
    >
      Oiya, kita juga lagi bangun community bareng semua user Kudoku pake
      <strong
        style="
          font-weight: bolder;
          box-sizing: inherit;
          font-family: Avenir, Helvetica, Arial, sans-serif;
        "
        >Discord</strong
      >
      nih. Lo bisa join
      <a
        href="${DISCORD}"
        style="
          background-color: transparent;
          box-sizing: inherit;
          font-family: Avenir, Helvetica, Arial, sans-serif;
          color: #4183c4;
          text-decoration: none;
        "
        rel="nofollow"
        >disini</a
      >.
    </p>

    <p
      style="
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.4285em;
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.87);
        margin: 0 0 1em;
      "
    >
      Aplikasi Kudoku bentar lagi masuk versi Alpha-nya. Tim Kudoku lagi pada
      ngopi semangat buat aplikasinya. Lo bakal segera masuk kok tenang aja!
    </p>

    <p
      style="
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.4285em;
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.87);
        margin: 0 0 1em;
      "
    >
      Anyway, lo pasti sekarang lagi ngisi form selanjutnya. Kudoku appreciate
      bgt kalo lo nyelesain formnya. Tapi kalo lo mau ngisinya nanti, ini gua
      kasih linknya:
    </p>

    <div
      style="
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        padding: 1em;
      "
      align="center"
    >
      <a
        href="${FORMLINK}"
        style="
          background-color: #2c5ea8;
          box-sizing: inherit;
          font-family: Avenir, Helvetica, Arial, sans-serif;
          color: white;
          text-decoration: none;
          font-weight: bold;
          display: inline-block;
          cursor: pointer;
          line-height: 1em;
          text-align: center;
          border-radius: 6px;
          padding: 13px 27px;
        "
        rel="nofollow"
      >
        Lanjutin Form
      </a>
    </div>

    <p
      style="
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.4285em;
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.87);
        margin: 0 0 1em;
      "
    >
      Tapi gua penasaran: apa yang buat lo daftar? Gua pengen tau buat bikin
      Kudoku tambah mantap banget. Feel free to reply this email and talk with
      me :)
    </p>

    <p
      style="
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.4285em;
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.87);
        margin: 0 0 1em;
      "
    >
      Hope you have a sunny day Kudos 🌞!
    </p>

    <p
      style="
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.4285em;
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.87);
        margin: 0 0 1em;
      "
    >
      Furqon,<br />
      Founder of Kudoku
    </p>
  </div>

  <div
    style="
      box-sizing: inherit;
      font-family: Avenir, Helvetica, Arial, sans-serif;
    "
    align="center"
  >
    <p
      style="
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.4285em;
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.87);
        margin: 0 0 1em;
      "
    >
      PT. Kudoku Finansial Indonesia<br
        style="
          box-sizing: inherit;
          font-family: Avenir, Helvetica, Arial, sans-serif;
        "
      />
      Jakarta, Indonesia
    </p>
  </div>
</div>
`;

  const msg = {
    to: email,
    from: 'Furqon @ Kudoku <furqon@kudoku.id>',
    subject: 'Terima kasih sudah ikut waitlist 🤩',
    text: `Kamu sudah jadi Kudos No. ${id}!`,
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
