import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    console.log('Environment variables:', {
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_DATABASE: process.env.DB_DATABASE,
    });

    const app = await NestFactory.create(AppModule);
    setupSwagger(app);
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

function setupSwagger(app) {
    const config = new DocumentBuilder()
        .setTitle('CarStats API')
        .setDescription('API do CarStats')
        .setVersion('1.0')
        .addApiKey({ type: 'apiKey', name: 'x-user-id', in: 'header' }, 'X-User-ID')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
}
