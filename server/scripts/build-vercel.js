import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('dist/api', { recursive: true });

await writeFile(
  'dist/index.js',
  "import app from '../index.js';\n\nexport default app;\n",
);

await writeFile(
  'dist/api/index.js',
  "import app from '../../index.js';\n\nexport default app;\n",
);

console.log('Vercel server entrypoints generated in dist/');
