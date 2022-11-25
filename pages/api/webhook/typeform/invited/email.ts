import type { NextApiRequest, NextApiResponse } from 'next';
import verifyHeader from '$utils/typeform/verifyheader';
import sgMail from '@sendgrid/mail';
import pool from '$utils/postgres';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event_type, form_response } = req.body;

  const id = form_response.answers[0].number as number;

  const isValid = verifyHeader(req, event_type);

  if (isValid) {
    try {
      const data = await dbQuery(id);

      const kudosData: KudosData = {
        id: data.id,
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        wa: data.whatsapp,
        registerDate: data.registerdate,
        invited: data.invited,
        subscribe: data.subscribe,
      };

      const response = await sendInvitationEmail(kudosData);
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

async function sendInvitationEmail({
  id,
  firstName,
  email,
}: KudosData): Promise<sgMail.ClientResponse> {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

  const DISCORD = 'https://discord.gg/S9TVVv5YU3';
  const YOUTUBE = 'https://youtu.be/2ebPSAG_pvI';

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
      Heyy ${firstName}, Kudos No. ${id}👋🏼!
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
      Ada kabar baik nih!
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
      📣 Kamu udah bisa masuk ke aplikasi Kudoku! 🥳 🎉
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
      Lo harusnya udah
      <a href="https://app.kudoku.id" rel="nofollow">install aplikasi Kudoku</a>
      di device lo. Nah abis itu, lo tinggal
      <strong>klik "Check Antrian"</strong> dan masukin nomor WhatsApp yang lo
      pake buat daftar Kudoku.
    </p>

    <div
      style="
        box-sizing: inherit;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        margin: 1.5em 0;
      "
      align="center"
    >
      <img
        alt=""
        src="https://drive.google.com/uc?id=1JTqVPiVjB8KR-QXUFcDH3xhDhvW3O5mi"
        style="
          border: none;
          border-style: none;
          box-sizing: inherit;
          font-family: Avenir, Helvetica, Arial, sans-serif;
          width: 200px;
        "
      />
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
      Abis itu lo buat <strong>username</strong> sama
      <strong>password</strong> lo. Kalo udah tinggal login deh!
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
      Atau, kalo lo masih bingung, bisa tonton video tutorialnya.
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
        href="${YOUTUBE}"
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
        Tonton video tutorial
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
      Btw kalo kamu lupa, aplikasi Kudoku bisa di akses dengan klik di tombol
      "masuk" di website kita, atau kamu bisa klik
      <a
        href="https://app.kudoku.id"
        style="
          background-color: transparent;
          box-sizing: inherit;
          font-family: Avenir, Helvetica, Arial, sans-serif;
          color: #4183c4;
          text-decoration: none;
        "
        rel="nofollow"
        >link ini</a
      >
      yaa.
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
      Oiya, kamu udah join
      <strong
        style="
          font-weight: bolder;
          box-sizing: inherit;
          font-family: Avenir, Helvetica, Arial, sans-serif;
        "
        >Discord</strong
      >
      Kudoku? Kalo belom, kamu bisa join dengan klik link
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
        >ini</a
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
      Semoga kamu suka yaa sama appsnya! Dan jangan sungkan-sungkan untuk email
      tim Kudoku atau gua kalo kamu punya masukan/saran!
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
      Happy doing finances Kudos 😁!
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
    subject: 'Kamu diundang masuk Kudoku!🎉',
    text: 'Langsung aja buat username dan password!',
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
