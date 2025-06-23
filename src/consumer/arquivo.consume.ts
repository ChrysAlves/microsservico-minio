import { Injectable } from '@nestjs/common';
import { KafkaConsumerService } from 'src/core/kafka/kafka.consumer';
import { UploadService } from '../upload/upload.service';
import { ArquivoMessage } from './arquivo.interface';
import { KafkaProducerService } from 'src/core/kafka/kafka.producer';

@Injectable()
export class ArquivoConsume {
  constructor(
    private readonly consumerService: KafkaConsumerService,
    private readonly producerService: KafkaProducerService,
    private readonly uploadService: UploadService,
  ) {}

  async onModuleInit() {
    await this.consumerService.subscribe(
      ['arquivos-ref.upload'],
      async (payload) => {
        const message: ArquivoMessage = JSON.parse(
          payload.message.value.toString(),
        );
        await this.consoleLog(message);
        await this.uploadService.handleFile(
          message.urlTemporaria,
          message.filename,
          message.token,
          message.response_require_by,
        );
        console.log('upload realizado com sucesso');
      },
    );
  }

  private async consoleLog(message: ArquivoMessage) {
    console.log(message);
  }
}
