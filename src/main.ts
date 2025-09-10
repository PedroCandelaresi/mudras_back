import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS para permitir conexión con frontend
  const corsOrigin = process.env.CORS_ORIGIN || process.env.NODE_ENV === 'production' 
    ? ['https://mudras.nqn.net.ar'] 
    : true;
    
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Secret-Key'],
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
