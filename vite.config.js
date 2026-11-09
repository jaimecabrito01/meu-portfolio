import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compilePost } from './scripts/blog.mjs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'blog-markdown',
      transform(source, id) {
        if (!id.endsWith('.md')) return;
        return { code: `export default ${JSON.stringify(compilePost(source, id))}`, map: null };
      },
    },
  ],
});
