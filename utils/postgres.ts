import pg from 'pg';

const Pool = pg.Pool;

const pool = new Pool({
  user: process.env.PGUSERNAME as string,
  password: process.env.PGPASSWORD as string,
  host: process.env.PGHOST as string,
  port: process.env.PGPORT as unknown as number,
  database: process.env.PGDATABASE as string,
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.PGCACERT as string,
  },
});

export default pool;
