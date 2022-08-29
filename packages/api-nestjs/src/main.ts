import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const BASE_API_URL = 'api/v2';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: ['http://localhost:4200', 'http://localhost:4201'],
        credentials: true
    });
    app.setGlobalPrefix(BASE_API_URL);

    const swaggerConfig = new DocumentBuilder()
        .setTitle('DESC API v2')
        .setDescription('A RESTful API for the DESC web project')
        .setVersion('2.0')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${BASE_API_URL}/doc`, app, document);

    await app.listen(3001);
}
bootstrap();
