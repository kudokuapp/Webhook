import pool from '$utils/postgres';

/**
 * Summary. This function will get the latest id from our database and return it.
 * @return {number} The ID.
 */
const getKudosNumber = (): Promise<number> => {
  const query = 'SELECT * FROM users_final ORDER BY id DESC LIMIT 1';
  const arr: any[] = [];
  return new Promise((resolve, reject) => {
    pool.query(query, arr, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve((res.rows[0].id as number) + 1);
      }
    });
  });
};

export default getKudosNumber;
