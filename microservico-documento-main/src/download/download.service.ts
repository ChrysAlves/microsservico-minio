import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { Readable } from 'stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class DownloadService {
  private s3: S3Client;

  constructor() {
    //mesma coisa do upload service
    this.s3 = new S3Client({
      region: process.env.S3_REGION ,
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
      forcePathStyle: true,
    });
  }

  async downloadFile(key: string): Promise<StreamableFile> {
    // streamableFile serve para enviar o arquivo ao navegador
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });

    try {
      // tenta baixar o arquivo
      const data = await this.s3.send(command);

      const stream = data.Body as Readable; // passa o body para o stream (readable, que pode ser lido aos poucos)

      return new StreamableFile(stream, {
        type: data.ContentType, // define o tipo do arquivo
        disposition: `attachment; filename="${key}"`, // define como o navegador deve tratar o arquivo(abrir direto ou fz download com o nome do arq)
      });
    } catch (error) {
      console.error('Erro ao baixar:', error);
      throw new NotFoundException('Arquivo não encontrado no bucket');
    }
  }
  async gerarPresignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });

    try {
      const signedUrl = await getSignedUrl(this.s3, command, {
        expiresIn: 60 * 5,
      });

      return signedUrl;
    } catch (error) {
      console.error('Erro ao gerar presigned URL:', error);
      throw new NotFoundException('Não foi possível gerar a URL temporária.');
    }
  }
}
