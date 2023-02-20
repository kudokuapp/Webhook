/**
 * Summary. Convert brick institutionId to a readable string.
 * Example. "11" or 11 to "Gopay"
 * @returns {string} readable string.
 */
export default function institutionIdToString(institutionId: number) {
  switch (institutionId) {
    case 2:
      return 'BCA';

    case 3:
      return 'Mandiri';

    case 4:
      return 'BNI';

    case 5:
      return 'BRI';

    case 11:
      return 'Gopay';

    case 12:
      return 'OVO';

    case 16:
      return 'BRI';

    case 17:
      return 'Mandiri';

    case 26:
      return 'BSI';

    case 33:
      return 'Shopee Pay';

    case 34:
      return 'BSI';

    case 37:
      return 'BCA';

    case 38:
      return 'BCA';

    default:
      return 'BCA';
  }
}
