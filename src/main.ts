import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS para permitir conexión con frontend
  app.enableCors({
    origin: true, // Permite cualquier origen en desarrollo
    credentials: true,
  });

  // Pipe global de validación
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen(4000, '0.0.0.0');
  console.log('🚀 Servidor GraphQL ejecutándose en http://0.0.0.0:4000/graphql');
}
bootstrap();
