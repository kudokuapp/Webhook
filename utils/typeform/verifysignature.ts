import crypto from 'crypto';

/**
 * Summary. This function is a secure way to verify that the incoming request is from Typeform.
 * @param {string} receivedSignature
 * @param {crypto.BinaryLike} payload
 * @param {crypto.BinaryLike} webhookSecret
 * @returns {boolean}
 */

const verifySignature = (
  receivedSignature: string,
  payload: crypto.BinaryLike,
  webhookSecret: crypto.BinaryLike
) => {
  const hash = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('base64');

  return receivedSignature === `sha256=${hash}`;
};

export default verifySignature;
