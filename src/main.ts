// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Adicione esta importação

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
  });

  app.enableCors({
    origin: '*',
  });

  // --- Início da configuração do Swagger ---
  const config = new DocumentBuilder()
    .setTitle('Document Microservice API') // Título da sua API
    .setDescription('API para gerenciamento de documentos (upload, download, delete)') // Descrição da API
    .setVersion('1.0') // Versão da API
    //.addBearerAuth() // Se você tiver autenticação JWT, adicione isso
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // O endpoint da documentação será /api
  // --- Fim da configuração do Swagger ---

  await app.startAllMicroservices();
  const PORT = process.env.PORT || 3001; //
  await app.listen(PORT); //

  console.log(
    `Servidor rodando na porta <span class="math-inline">\{PORT\} \- Documentação disponível em http\://localhost\:</span>{PORT}/api`,
  ); //
}
bootstrap();