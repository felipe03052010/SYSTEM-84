import { connect } from './db-common.mjs';
const db = await connect();
try {
  const [version] = await db.query('SELECT VERSION() AS version, @@port AS port, @@bind_address AS bind_address');
  const [counts] = await db.query(`SELECT (SELECT COUNT(*) FROM works) AS works,
    (SELECT COUNT(*) FROM media) AS media, (SELECT COUNT(*) FROM sources) AS sources`);
  const [categories] = await db.query('SELECT type,COUNT(*) AS count FROM works GROUP BY type ORDER BY type');
  console.log(JSON.stringify({server:version[0],counts:counts[0],categories}, null, 2));
} finally { await db.end(); }
