import { NextApiRequest } from 'next';

/**
 * Summary. Altervative verification that the incoming response is from Typeform. Less secure.
 * @param {NextApiRequest} req
 * @param {string} event_type
 * @returns {boolean}
 */

const verifyHeader = (req: NextApiRequest, event_type: string) => {
  const isValid =
    req.method === 'POST' &&
    req.headers['user-agent'] === 'Typeform Webhooks' &&
    req.headers['typeform-signature'] &&
    event_type === 'form_response';

  return isValid;
};

export default verifyHeader;
