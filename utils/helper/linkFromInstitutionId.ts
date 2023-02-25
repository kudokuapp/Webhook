/**
 * Summary. Convert brick institutionId to a link.
 * Example. "11" or 11 to https://bgst.kudoku.id/connect/gopay
 * @returns {string} link.
 */
export default function linkFromInstitutionId(institutionId: number) {
  switch (institutionId) {
    case 2:
      return 'https://bgst.kudoku.id/account/connect/bca/2';

    case 3:
      return 'https://bgst.kudoku.id/account/connect/mandiri/3';

    case 4:
      return 'https://bgst.kudoku.id/account/connect/bni';

    case 5:
      return 'https://bgst.kudoku.id/account/connect/bri/5';

    case 11:
      return 'https://bgst.kudoku.id/account/connect/gopay';

    case 12:
      return 'https://bgst.kudoku.id/account/connect/ovo';

    case 16:
      return 'https://bgst.kudoku.id/account/connect/bri/16';

    case 17:
      return 'https://bgst.kudoku.id/account/connect/mandiri/17';

    case 26:
      return 'https://bgst.kudoku.id/account/connect/bsi/26';

    case 33:
      return 'https://bgst.kudoku.id/account/connect/shopeepay';

    case 34:
      return 'https://bgst.kudoku.id/account/connect/bsi/34';

    case 37:
      return 'https://bgst.kudoku.id/account/connect/bca/37';

    case 38:
      return 'https://bgst.kudoku.id/account/connect/bca/38';

    default:
      return 'https://bgst.kudoku.id/account/connect/bca/2';
  }
}
