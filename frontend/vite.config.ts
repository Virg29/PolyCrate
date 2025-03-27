import { defineConfig } from 'vite';
import * as dotenv from 'dotenv';
import react from '@vitejs/plugin-react';
import path from 'path';

//#region Envs processing
const envPath = path.join(process.cwd(), '../.env');
dotenv.config({ path: envPath });

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@nodespecs': path.resolve(
				__dirname,
				'../comspecs/generated/index.ts',
			),
			'@adamtypes': path.resolve(__dirname, '../types/index.ts'),
		},
	},
	plugins: [react()],
	base: './',
	server: {
		port: Number(process.env.VITE_PORT),
	},
	css: {
		preprocessorOptions: {
			less: {
				math: 'always',
				relativeUrls: true,
				javascriptEnabled: true,
			},
		},
	},
	define: {
		'process.env': {},
	},
});
