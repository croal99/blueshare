import react from "@vitejs/plugin-react-swc";
import path, {resolve} from "path";

export default {
    plugins: [
        react(),
    ],
    server: {
        host: '0.0.0.0',
        port: 8000,
        hmr: {
            // overlay: false,
        },
        proxy: {
            // '/foo': 'http://localhost:4567',
            '/api': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/api/'),
            },
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@images': path.resolve(__dirname, './public/images'),
            '@style': path.resolve(__dirname, './src/style'),
        }
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                // nested: resolve(__dirname, 'admin/index.html'),
            },
        },
    },
}
