import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

// Exercise deployment transitions without a Docker daemon or production access.
test('deploy conserva a versão saudável em falhas de build e restaura após falha de healthcheck', () => {
  const directory = mkdtempSync(join(tmpdir(), 'portfolio-deploy-'));
  try {
    const bin = join(directory, 'bin');
    const fixture = join(directory, 'fixture');
    const root = join(directory, 'server');
    const log = join(directory, 'docker.log');
    mkdirSync(bin); mkdirSync(fixture);
    writeFileSync(join(fixture, 'compose.yaml'), 'services: {}\n');
    writeFileSync(join(bin, 'git'), `#!/bin/sh
if [ "$1" = rev-parse ]; then printf '%s\\n' "$TEST_SHA"; else tar -c -C "$TEST_FIXTURE" compose.yaml; fi
`, { mode: 0o755 });
    writeFileSync(join(bin, 'docker'), `#!${process.execPath}
const fs = require('node:fs');
const args = process.argv.slice(2);
fs.appendFileSync(process.env.TEST_LOG, JSON.stringify({args, port: process.env.PORT}) + '\\n');
if (args.includes('build') && process.env.TEST_FAIL === 'build') process.exit(1);
if (args.includes('up') && process.env.TEST_FAIL === 'health') {
  const envFile = args[args.indexOf('--env-file') + 1];
  if (fs.readFileSync(envFile, 'utf8').includes('IMAGE_TAG=' + process.env.TEST_SHA)) process.exit(1);
}
`, { mode: 0o755 });
    const base = { ...process.env, PATH: `${bin}:${process.env.PATH}`, DEPLOY_ROOT: root, PORT: '8080', BIND_ADDRESS: '127.0.0.1', TEST_LOG: log, TEST_FIXTURE: fixture };
    const run = (sha, fail = '') => spawnSync('bash', [resolve('scripts/deploy.sh')], { env: { ...base, TEST_SHA: sha, TEST_FAIL: fail }, encoding: 'utf8' });
    const first = run('a'.repeat(40));
    assert.equal(first.status, 0, first.stderr);
    const healthy = readlinkSync(join(root, 'current'));
    writeFileSync(log, '');
    const build = run('b'.repeat(40), 'build');
    assert.equal(build.status, 1);
    assert.equal(readlinkSync(join(root, 'current')), healthy);
    assert.ok(!readFileSync(log, 'utf8').includes('"up"'), 'build failure must not replace containers');
    writeFileSync(log, '');
    const health = run('c'.repeat(40), 'health');
    assert.equal(health.status, 1);
    assert.match(health.stderr, /Restaurando/);
    assert.equal(readlinkSync(join(root, 'current')), healthy);
    const starts = readFileSync(log, 'utf8').trim().split('\n').map(line => JSON.parse(line)).filter(call => call.args.includes('up'));
    assert.equal(starts.length, 2);
    assert.ok(starts[1].args.includes(join(healthy, '.env')));
    assert.equal(starts[1].port, undefined, 'rollback must use persisted configuration');
    const fresh = spawnSync('bash', [resolve('scripts/deploy.sh')], { env: { ...base, DEPLOY_ROOT: join(directory, 'fresh'), TEST_SHA: 'd'.repeat(40), TEST_FAIL: 'health' }, encoding: 'utf8' });
    assert.equal(fresh.status, 1);
    assert.match(fresh.stderr, /Primeiro deploy/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
