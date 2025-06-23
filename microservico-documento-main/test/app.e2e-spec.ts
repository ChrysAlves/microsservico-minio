import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest'; // Importa supertest para fazer requisições HTTP
import { INestApplication } from '@nestjs/common';
import { DownloadModule } from '../src/download/download.module'; // Importa o módulo do download

// Configurar variáveis de ambiente de teste
// Isso é crucial para que o construtor do DownloadService não falhe
process.env.S3_REGION = 'us-east-1';
process.env.S3_ENDPOINT = 'http://localhost:4566'; // Use um endpoint de mock S3 se não tiver AWS real
process.env.S3_ACCESS_KEY = 'test';
process.env.S3_SECRET_KEY = 'test';
process.env.S3_BUCKET = 'test-bucket';

describe('DownloadController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // Importamos o módulo real (ou os módulos necessários)
      // Isso fará com que todos os controllers, services, etc. sejam provisionados.
      imports: [DownloadModule],
      // Você pode adicionar overrides de provedores aqui se precisar mockar
      // algumas dependências que não queremos que sejam reais nos testes E2E
      // Por exemplo, mockar a comunicação com um banco de dados externo ou Kafka
      // { provide: 'KAFKA_CLIENT', useValue: { send: jest.fn() } },
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init(); // Inicia a aplicação NestJS
  });

  // Testa o endpoint de URL pré-assinada
  it('/download/presigned/:key (GET) - should return a presigned URL', () => {
    const testKey = 'test-file.txt';
    return request(app.getHttpServer())
      .get(`/download/presigned/${testKey}`) // Faz uma requisição GET para o endpoint
      .expect(200) // Espera um status HTTP 200 (OK)
      .expect((res) => {
        // Verifica o corpo da resposta
        expect(res.body).toHaveProperty('url');
        expect(typeof res.body.url).toBe('string');
        // Opcional: verificar se a URL é válida (se possível para seu mock/ambiente)
        // expect(res.body.url).toContain(testKey);
      });
  });

  // Testa o endpoint de download de arquivo (requer um mock de S3 funcionando ou arquivo real)
  // Este teste é mais complexo porque envolve a StreamableFile
  // Para fins de um teste E2E básico sem um S3 real ou mock avançado:
  it('/download/:key (GET) - should return a file stream', async () => {
    const testKey = 'test-file-for-download.pdf';
    // ATENÇÃO: Para este teste funcionar sem um S3 real,
    // o S3Client no DownloadService precisaria ser mockado de forma mais complexa
    // ou você precisaria de um serviço mock de S3 (como Localstack rodando).
    // A forma como está, o serviço vai tentar chamar o S3 real (ou seu endpoint mockado de TESTE).

    // Se você tiver um Localstack ou um S3 de teste configurado e com o arquivo:
    // Crie um arquivo real de teste no seu bucket para este teste.

    // Se você NÃO tiver um S3 real/mock, o teste vai falhar com erro S3.
    // Nesses casos, para um teste E2E, você precisaria de um mock de S3
    // ou testar o erro de NotFoundException.

    // Por enquanto, vamos assumir que ele pode receber uma resposta.
    // Você pode ter que refinar este teste se o erro do S3 persistir.
    const response = await request(app.getHttpServer())
      .get(`/download/${testKey}`)
      .expect(200); // Espera um status HTTP 200 (OK) ou 404 se não mockar S3

    // Verificar os headers do arquivo
    expect(response.headers['content-type']).toBe('application/pdf'); // ou outro tipo
    expect(response.headers['content-disposition']).toContain(`attachment; filename="${testKey}"`);
    // Pode verificar o corpo se for um arquivo pequeno ou mockado.
    // expect(response.text).toBe('Conteúdo do arquivo');
  });

  afterEach(async () => {
    await app.close(); // Garante que a aplicação seja fechada após cada teste
  });
});