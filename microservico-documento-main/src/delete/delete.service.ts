import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'; //
import { Injectable, NotFoundException } from '@nestjs/common'; //

@Injectable()
export class DeleteService {
  private s3: S3Client; //

  constructor() { //
    this.s3 = new S3Client({ //
      region: process.env.S3_REGION, //
      endpoint: process.env.S3_ENDPOINT, //
      credentials: { //
        accessKeyId: process.env.S3_ACCESS_KEY, //
        secretAccessKey: process.env.S3_SECRET_KEY, //
      },
      forcePathStyle: true, //
    });
  }

  async deleteFile(key: string): Promise<void> { //
    const command = new DeleteObjectCommand({ //
      Bucket: process.env.S3_BUCKET, //
      Key: key, //
    });

    try {
      await this.s3.send(command); //
      // A operação de delete do S3 retorna 204 No Content se bem-sucedida,
      // mesmo que o objeto não exista. Para ser mais preciso, você pode
      // verificar se o objeto existe antes de deletar, mas para uma
      // função simples, deletar direto é comum.
      console.log(`Arquivo '${key}' deletado com sucesso.`); //
    } catch (error) { //
      console.error('Erro ao deletar arquivo:', error); //
      // Se houver um erro real do S3 que não seja apenas NotFound,
      // ele será lançado aqui. Para este exemplo, lançamos NotFoundException.
      throw new NotFoundException(`Não foi possível deletar o arquivo '${key}'.`); //
    }
  }
}