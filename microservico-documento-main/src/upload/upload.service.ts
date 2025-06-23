import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { KafkaProducerService } from 'src/core/kafka/kafka.producer';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private readonly logger: Logger;

  constructor(private readonly producer: KafkaProducerService) {
    this.s3 = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
      forcePathStyle: true,
    });
  }

  async handleFile(
    urlTemporaria: string,
    filename: string,
    token: string,
    response_require_by: string,
  ) {
    console.log('[DEBUG] Iniciando download do arquivo:', urlTemporaria);
    try {
      const response = await fetch(urlTemporaria);
      console.log('[DEBUG] Status da resposta:', response.status);

      if (!response.ok) {
        console.error(
          '[ERROR] Resposta não OK:',
          response.status,
          response.statusText,
        );
        throw new Error(`Falha ao baixar o arquivo: ${response.statusText}`);
      }

      const contentType =
        response.headers.get('content-type') || 'application/octet-stream';
      console.log('[DEBUG] Content-Type:', contentType);

      const buffer = Buffer.from(await response.arrayBuffer());

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
      });

      await this.s3.send(command);
    } catch (error) {
      console.error('Erro ao baixar e enviar o arquivo:', error);
      throw error;
    }
    const etag = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: filename,
    });

    const response = await this.s3.send(etag);
    console.log('[DEBUG] ETag:', response.ETag);

    const kafkaPayload = {
      token,
      filename,
      etag: response.ETag,
      target_service: response_require_by,
    };

    await this.producer.send({
      topic: 'arquivos.uploaded',
      messages: [{ value: JSON.stringify(kafkaPayload) }],
    });

    return {
      message: 'Arquivo enviado com sucesso!',
      filename,
      urlTemporaria1: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${filename}`,
    };
  }
}
