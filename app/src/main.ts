// src/main.ts

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type {
	CorsConfig,
	NestConfig,
	SwaggerConfig,
} from 'src/common/config/config.interface';
import compression from 'compression';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// Validation
	app.useGlobalPipes(
		new ValidationPipe({ transform: true, whitelist: true }),
	);

	app.use(compression());
	// Payload size
	app.use(json({ limit: '50mb' }));
	app.use(urlencoded({ extended: true, limit: '50mb' }));
	// app.useGlobalFilters(new PrismaExceptionFilter());

	const configService = app.get(ConfigService);
	const nestConfig = configService.get<NestConfig>('nest');
	const corsConfig = configService.get<CorsConfig>('cors');
	const swaggerConfig = configService.get<SwaggerConfig>('swagger');

	// Swagger Api
	if (swaggerConfig.enabled) {
		const options = new DocumentBuilder()
			.setTitle(swaggerConfig.title || 'Nestjs')
			.setDescription(
				swaggerConfig.description || 'The nestjs API description',
			)
			.addBearerAuth()
			.setVersion(swaggerConfig.version || '1.0')
			.build();
		const document = SwaggerModule.createDocument(app, options);

		SwaggerModule.setup(swaggerConfig.path || 'api', app, document, {
			swaggerOptions: {
				persistAuthorization: true,
			},
		});
	}
	console.log(corsConfig.config);
	// Cors
	if (corsConfig.enabled) {
		app.enableCors(corsConfig.config);
	}

	await app.listen(nestConfig.port || 3000);
	//process.env.PORT || nestConfig.port ||
}
bootstrap();
