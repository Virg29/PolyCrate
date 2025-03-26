import { corsutils } from '../utils';
import type { Config } from './config.interface';
import * as process from 'process';

const applicationConfig: Config = {
	nest: {
		port: 3000,
	},
	cors: {
		enabled: true,
		config: {
			origin: ['http://localhost:5173'], // Frontend development server
			credentials: true,
			allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
			maxAge: 3600,
		},
	},
	swagger: {
		enabled: true,
		title: 'Api',
		description: 'API description',
		version: '0.1',
		path: 'api',
	},
	security: {
		jwtSecret:
			'wow,thats very good enough string to use it as secret token! congrats! u reached masterpiece of creation such phrases!',
		expiresIn: '7d',
		bcryptSaltOrRound: 10,
	},
};

export default (): Config => applicationConfig;
