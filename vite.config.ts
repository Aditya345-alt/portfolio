import path from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { processContactSubmission } from './src/server/contactHandler.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function contactApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'contact-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
          return;
        }

        let rawBody = '';
        req.on('data', (chunk: Buffer) => {
          rawBody += chunk.toString();
        });

        req.on('end', async () => {
          let body = {};
          try {
            if (rawBody) body = JSON.parse(rawBody);
          } catch {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: 'Invalid JSON format.' }));
            return;
          }

          const clientIp =
            (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
            req.socket.remoteAddress ||
            '127.0.0.1';

          const result = await processContactSubmission(body, clientIp, env);

          res.statusCode = result.statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result.data));
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), contactApiPlugin(env)],
    resolve: {
      dedupe: ['react', 'react-dom', 'three'],
      alias: {
        "@": path.resolve(__dirname, "./src"),
        react: path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
        "three/addons": path.resolve(__dirname, "./node_modules/three/examples/jsm"),
        three: path.resolve(__dirname, "./node_modules/three/build/three.module.js"),
        "@designcodeio/threeui/style.css": path.resolve(__dirname, "./src/shaders/threeui.css"),
        "@designcodeio/threeui": path.resolve(__dirname, "./src/threeui-entry.ts"),
      },
    },
  };
})
