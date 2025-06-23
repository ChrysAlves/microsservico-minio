import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Producer, ProducerRecord } from 'kafkajs';
import { KafkaClient } from './kafka.client';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  public producer: Producer;
  public isConnected = false;
  private readonly logger = new Logger(KafkaProducerService.name);

  constructor() {
    this.producer = KafkaClient.getInstance().producer();
  }

  // async onModuleInit() {
  //   try {
  //     await this.producer.connect();
  //     this.isConnected = true;
  //     this.logger.log('Kafka producer conectado com sucesso.');
  //   } catch (error) {
  //     this.isConnected = false;
  //     this.logger.error('Erro ao conectar ao Kafka producer. Tentando novamente...', error);
  //   }
  // }

  async onModuleInit() {
    const maxAttempts = 1;
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.producer.connect();
        this.isConnected = true;
        this.logger.log('Kafka producer conectado com sucesso.');
        return;
      } catch (error) {
        this.logger.warn(
          `Tentativa ${attempt} de conexão falhou. Tentando novamente em 3 segundos...`,
        );
        await delay(3000);
      }
    }

    this.logger.error('Falha ao conectar com o Kafka após várias tentativas.');
    this.isConnected = false;
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.producer.disconnect();
      this.logger.log('Kafka producer desconectado.');
    }
  }

  async send(params: { topic: string; messages: any[] }) {
    // Timeout de 1,5 segundos para envio
    return Promise.race([
      this.producer.send({
        topic: params.topic,
        messages: params.messages,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Kafka timeout')), 1500),
      ),
    ]);
  }
}
