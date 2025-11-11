import { register } from 'tsconfig-paths';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

declare const __dirname: string;

const root = resolve(__dirname, '../../..');
const base = resolve(root, 'tsconfig.base.json');
const fallback = resolve(root, 'tsconfig.json');
const tsconfigPath = existsSync(base) ? base : fallback;
const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));

register({
  baseUrl: root,
  paths: tsconfig.compilerOptions.paths,
});
