import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        accueil: 'index.html',
        boutique: 'boutique.html',
        nouveautes: 'nouveautes.html',
        collections: 'collections.html',
        produit: 'produit.html',
        panier: 'panier.html',
        contact: 'contact.html'
      }
    }
  }
});