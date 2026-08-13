import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'esbuild';

const project = resolve(import.meta.dirname, '..');
const cloudflareOutput = resolve(project, '.svelte-kit/cloudflare');
const dist = resolve(project, 'dist');
const server = resolve(dist, 'server');
const client = resolve(dist, 'client');

await rm(dist, { recursive: true, force: true });
await mkdir(server, { recursive: true });
await mkdir(client, { recursive: true });
await cp(cloudflareOutput, client, { recursive: true });
await build({
	entryPoints: [resolve(cloudflareOutput, '_worker.js')],
	outfile: resolve(server, 'index.js'),
	bundle: true,
	format: 'esm',
	platform: 'neutral',
	external: ['cloudflare:workers'],
	conditions: ['workerd', 'worker', 'browser']
});

console.log('Staged Cloudflare-compatible output in dist/');
