import commonConfig from './vite.config.common';

export default {
    ...commonConfig,
    build: {
        outDir:'../blueshare-api/html',
        emptyOutDir: true,
    },
    base: '/',
};
