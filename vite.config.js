import { defineConfig } from 'vite';
import { createReadStream, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const videoFiles = ['celineboutique3D.mp4', 'parfum3D.mp4', 'parfum2D.mp4', 'Robe.mp4', 'robe3D.mp4'];
const imageFiles = ['Veste Sépia.jpg', 'Robe Noyer.jpeg', 'sac.jpg'];

const staticProjectFilesPlugin = {
  name: 'serve-and-emit-project-static-files',
  configureServer(server) {
    server.middlewares.use('/assets/videos', (request, response, next) => {
      const fileName = basename(decodeURIComponent(request.url.split('?')[0]));
      if (!videoFiles.includes(fileName)) return next();
      response.setHeader('Content-Type', 'video/mp4');
      createReadStream(resolve('assets/videos', fileName)).on('error', next).pipe(response);
    });
  },
  generateBundle() {
    for (const partial of ['header', 'footer']) {
      this.emitFile({ type: 'asset', fileName: `src/partials/${partial}.html`, source: readFileSync(`src/partials/${partial}.html`, 'utf8') });
    }
    for (const video of videoFiles) {
      this.emitFile({ type: 'asset', fileName: `assets/videos/${video}`, source: readFileSync(`assets/videos/${video}`) });
    }
    for (const image of imageFiles) {
      this.emitFile({ type: 'asset', fileName: `assets/images/${image}`, source: readFileSync(`assets/images/${image}`) });
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
