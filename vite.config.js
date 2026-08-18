import { defineConfig } from 'vite';
import { createReadStream, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const staticProjectFilesPlugin = {
  name: 'serve-and-emit-project-static-files',
  configureServer(server) {
    server.middlewares.use('/assets/videos', (request, response, next) => {
      const fileName = basename(decodeURIComponent(request.url.split('?')[0]));
      if (!['celineboutique3D.mp4', 'parfum3D.mp4'].includes(fileName)) return next();
      response.setHeader('Content-Type', 'video/mp4');
      createReadStream(resolve('assets/videos', fileName)).on('error', next).pipe(response);
    });
  },
  generateBundle() {
    for (const partial of ['header', 'footer']) {
      this.emitFile({ type: 'asset', fileName: `src/partials/${partial}.html`, source: readFileSync(`src/partials/${partial}.html`, 'utf8') });
    }
    for (const video of ['celineboutique3D.mp4', 'parfum3D.mp4']) {
      this.emitFile({ type: 'asset', fileName: `assets/videos/${video}`, source: readFileSync(`assets/videos/${video}`) });
    }
  }
};

export default defineConfig({
  plugins: [staticProjectFilesPlugin],
  build: {
    rollupOptions: {
      input: { accueil: 'index.html', boutique: 'boutique.html', produit: 'produit.html', panier: 'panier.html' }
    }
  }
});
