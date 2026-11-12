import { writeFile, rename } from 'node:fs/promises';
import { connect, readCatalog } from './db-common.mjs';

const db = await connect();
try {
  const records = await readCatalog(db);
  if (!records.length) throw new Error('Banco vazio: exportação cancelada para preservar o catálogo.');
  const target = new URL('../src/data/catalog.json', import.meta.url);
  const temp = new URL('../src/data/catalog.json.tmp', import.meta.url);
  await writeFile(temp, JSON.stringify(records, null, 2) + '\n');
  await rename(temp, target);
  console.log(`${records.length} obras exportadas. Execute npm run build para atualizar o site.`);
} finally { await db.end(); }
