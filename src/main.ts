import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'aws-sdk';

async function start() {
    const PORT = process.env.APP_PORT || 5000;
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

    const configService = app.get(ConfigService);

    config.update({
        accessKeyId: configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: configService.get('AWS_SECRET_KEY'),
        region: configService.get('AWS_REGION'),
    });

    const swaggerConfig = new DocumentBuilder()
    .setTitle('Coursuch API')
    .setVersion('1.0')
    .addServer('http://localhost:' + configService.get('APP_PORT'), 'Coursuch Local')
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('/api/docs', app, document);

    fs.writeFileSync('swagger.json', JSON.stringify(document), { encoding: 'utf8' });

    await app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();