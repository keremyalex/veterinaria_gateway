import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Origin', 
      'X-Requested-With', 
      'Content-Type', 
      'Accept', 
      'Authorization', 
      'x-request-id',
      'x-apollo-operation-name',
      'apollo-require-preflight'
    ],
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
