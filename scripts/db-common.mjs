import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const envPath = new URL('../.env.local', import.meta.url);
if (existsSync(envPath)) process.loadEnvFile(envPath);

export function connect() {
  if (!process.env.MYSQL_PASSWORD) throw new Error('Configure MYSQL_PASSWORD em .env.local antes de acessar o banco.');
  return mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3307),
    user: process.env.MYSQL_USER || 'system84_app',
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'system84',
    charset: 'utf8mb4',
    multipleStatements: false,
  });
}

export function json(value) { return typeof value === 'string' ? JSON.parse(value) : value; }

export async function readCatalog(db) {
  const [works] = await db.query('SELECT * FROM works ORDER BY id');
  const [media] = await db.query('SELECT * FROM media ORDER BY work_id, position');
  const [sources] = await db.query('SELECT * FROM sources ORDER BY work_id, position');
  return works.map(work => ({
    ...json(work.metadata),
    id: work.id, code: work.code, type: work.type, title: work.title,
    year: work.publication_year, description: work.description, tags: json(work.tags),
    media: media.filter(item => item.work_id === work.id).map(item => ({
      ...json(item.metadata), title: item.title, kind: item.kind, path: item.file_path,
      ...(item.source_url !== null ? { sourceUrl: item.source_url } : {}),
      ...(item.license !== null ? { license: item.license } : {}),
      ...(item.language !== null ? { language: item.language } : {}),
    })),
    sources: sources.filter(item => item.work_id === work.id).map(item => ({
      ...json(item.metadata), title: item.title, url: item.url,
    })),
  }));
}
