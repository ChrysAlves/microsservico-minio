import { Consumer, EachMessagePayload } from 'kafkajs';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { getKafkaConfig } from './kafka.config';
import { KafkaClient } from './kafka.client';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;
  private messageHandlers = new Map<
    string,
    (payload: EachMessagePayload) => Promise<void>
  >();

  constructor() {
    const config = getKafkaConfig();
    this.consumer = KafkaClient.getInstance().consumer({
      groupId: config.groupId,
    });
  }
  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.run({
      eachMessage: async (payload) => {
        const handler = this.messageHandlers.get(payload.topic);
        if (handler) {
          await handler(payload);
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }

  async subscribe(
    topics: string[],
    handler: (payload: EachMessagePayload) => Promise<void>,
  ) {
    for (const topic of topics) {
      await this.consumer.subscribe({ topic, fromBeginning: true });
      this.messageHandlers.set(topic, handler);
    }
  }
}
