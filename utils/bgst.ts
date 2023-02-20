import pg from 'pg';

const Pool = pg.Pool;

const bgstpool = new Pool({
  user: process.env.PGUSERNAME as string,
  password: process.env.PGPASSWORD as string,
  host: process.env.PGHOST as string,
  port: process.env.BGSTPGPORT as unknown as number,
  database: process.env.BGSTPGDATABASE as string,
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.PGCACERT as string,
  },
});

export default bgstpool;
