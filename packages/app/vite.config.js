import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        "global": {},
        "stream": {},
        "process": {}
    },
    resolve: {
        alias: {
            inherits: './src/overrides/inherits.js'
        }
    },
    server: {
        port: 4200
    },
    plugins: [react()]
});

