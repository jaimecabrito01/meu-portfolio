import test from 'node:test';
import assert from 'node:assert/strict';
import { compilePost } from '../scripts/blog.mjs';

const source = `---
title: Impressão na rede
description: Um tutorial
date: 2026-06-02
tags: [linux]
---
# Olá
`;

test('preserva Markdown e data sem conversão de fuso; URLs aceitam nomes com acentos', () => {
  const post = compilePost(source, '/blog/meu-servidor-de-impressão.md');
  assert.equal(post.slug, 'meu-servidor-de-impressao');
  assert.equal(post.date, '2026-06-02');
  assert.equal(post.title, 'Impressão na rede');
  assert.deepEqual(post.tags, ['linux']);
  assert.match(post.content, /# Olá/);
});

test('rascunhos não incluem conteúdo no bundle público', () => {
  const post = compilePost(source.replace('tags: [linux]', 'draft: true'), 'rascunho.md');
  assert.equal(post.draft, true);
  assert.equal(post.content, undefined);
  assert.equal(post.title, undefined);
});

test('build rejeita artigos sem metadados e tags inválidas', () => {
  assert.throws(() => compilePost('# Sem metadados', 'invalido.md'), /Artigo inválido/);
  assert.throws(() => compilePost(source.replace('[linux]', 'linux'), 'invalido.md'), /Tags inválidas/);
});
