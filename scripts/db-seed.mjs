import { readFile } from 'node:fs/promises';
import { connect } from './db-common.mjs';

const records = JSON.parse(await readFile(new URL('../src/data/catalog.json', import.meta.url), 'utf8'));
if (!Array.isArray(records) || records.length === 0) throw new Error('Catálogo vazio ou inválido.');
const ids = new Set();
for (const record of records) {
  if (!Number.isSafeInteger(record.id) || record.id < 1 || ids.has(record.id) || !record.code || !record.title || !Array.isArray(record.tags) || !Array.isArray(record.media)) throw new Error('Registro inválido ou ID duplicado.');
  ids.add(record.id);
}
const db = await connect();
try {
  await db.beginTransaction();
  for (const record of records) {
    const { id, code, type, title, year, description, tags, media, sources = [], ...metadata } = record;
    await db.execute(`INSERT INTO works (id,code,type,title,publication_year,description,tags,metadata)
      VALUES (?,?,?,?,?,?,?,?) AS new
      ON DUPLICATE KEY UPDATE code=new.code,type=new.type,title=new.title,publication_year=new.publication_year,
      description=new.description,tags=new.tags,metadata=new.metadata`,
      [id, code, type, title, year, description, JSON.stringify(tags), JSON.stringify(metadata)]);
    await db.execute('DELETE FROM media WHERE work_id=?', [id]);
    await db.execute('DELETE FROM sources WHERE work_id=?', [id]);
    for (const [position, item] of media.entries()) {
      const { title: mediaTitle, kind, path, sourceUrl, license, language, ...extra } = item;
      await db.execute(`INSERT INTO media (work_id,position,title,kind,file_path,source_url,license,language,metadata)
        VALUES (?,?,?,?,?,?,?,?,?)`, [id,position,mediaTitle,kind,path,sourceUrl ?? null,license ?? null,language ?? null,JSON.stringify(extra)]);
    }
    for (const [position, item] of sources.entries()) {
      const { title: sourceTitle, url, ...extra } = item;
      await db.execute('INSERT INTO sources (work_id,position,title,url,metadata) VALUES (?,?,?,?,?)', [id,position,sourceTitle,url,JSON.stringify(extra)]);
    }
  }
  await db.commit();
  console.log(`${records.length} obras importadas no MySQL. Obras locais com outros IDs foram preservadas.`);
} catch (error) { await db.rollback(); throw error; }
finally { await db.end(); }
