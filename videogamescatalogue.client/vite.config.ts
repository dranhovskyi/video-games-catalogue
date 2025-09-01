import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Check if we're running in Docker or locally
const isDocker = fs.existsSync('./certs/key.pem') && fs.existsSync('./certs/cert.pem');

// Local development HTTPS setup (optional - can be disabled for HTTP)
const useLocalHttps = false; // Set to true if you want HTTPS locally

let httpsConfig = undefined;

if (isDocker) {
    // Docker environment - use generated certificates
    httpsConfig = {
        key: fs.readFileSync('./certs/key.pem'),
        cert: fs.readFileSync('./certs/cert.pem'),
    };
} else if (useLocalHttps) {
    // Local development with HTTPS (create certificates first)
    const certDir = './local-certs';
    const keyPath = path.join(certDir, 'key.pem');
    const certPath = path.join(certDir, 'cert.pem');

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        httpsConfig = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
        };
    } else {
        console.warn('HTTPS certificates not found for local development. Run the certificate generation script or disable HTTPS.');
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    build: {
        sourcemap: true, // Ensure source maps are generated
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        host: isDocker ? '0.0.0.0' : 'localhost', // Use 0.0.0.0 only in Docker
        port: 5173,
        https: httpsConfig, // undefined = HTTP, object = HTTPS
        proxy: {
            '^/api': {
                target: 'https://localhost:55027',
                secure: false,
                changeOrigin: true
            }
        }
    }
});