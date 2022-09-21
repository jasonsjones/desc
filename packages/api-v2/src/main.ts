import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

const BASE_API_URL = 'api/v2';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: ['http://localhost:4200', 'http://localhost:4201'],
        credentials: true
    });

    app.use(cookieParser());
    app.setGlobalPrefix(BASE_API_URL);

    const swaggerConfig = new DocumentBuilder()
        .setTitle('DESC API v2')
        .setDescription('A RESTful API for the DESC web project')
        .setVersion('2.0')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${BASE_API_URL}/doc`, app, document);

    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);

    await app.listen(3002);
}
bootstrap();
