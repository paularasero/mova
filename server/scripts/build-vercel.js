import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('dist/api', { recursive: true });

await writeFile(
  'dist/index.js',
  "import express from 'express';\nimport app from '../index.js';\n\nvoid express;\n\nexport default app;\n",
);

await writeFile(
  'dist/api/index.js',
  "import express from 'express';\nimport app from '../../index.js';\n\nvoid express;\n\nexport default app;\n",
);

console.log('Vercel server entrypoints generated in dist/');
