import pg from 'pg';

const Pool = pg.Pool;

const bgstpool = new Pool({ connectionString: process.env.BGSTCONNECTION });

export default bgstpool;
