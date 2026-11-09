import matter from 'gray-matter';
import { basename } from 'node:path';

export function normalizeSlug(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function compilePost(source, filename) {
  const { data, content } = matter(source);
  const slug = normalizeSlug(basename(filename, '.md'));
  if (data.draft === true) return { slug, draft: true };
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date;
  if (!data.title || !data.description || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') || Number.isNaN(Date.parse(date))) {
    throw new Error(`Artigo inválido: ${filename}. Informe title, description e date (AAAA-MM-DD).`);
  }
  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some(tag => typeof tag !== 'string'))) {
    throw new Error(`Tags inválidas em ${filename}: use uma lista de textos.`);
  }
  return { slug, title: data.title, description: data.description, date, tags: data.tags ?? [], content };
}
