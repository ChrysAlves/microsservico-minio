import { Kafka, logLevel } from 'kafkajs';
import { getKafkaConfig } from './kafka.config';

export class KafkaClient {
  private static instance: Kafka;

  static getInstance(): Kafka {
    if (!KafkaClient.instance) {
      const config = getKafkaConfig();
      KafkaClient.instance = new Kafka({
        clientId: config.clientId,
        brokers: config.brokers,
        logLevel: logLevel.ERROR,
        connectionTimeout: 5000, // 🔧 adiciona timeout de conexão de 5 segundos
        retry: {
          initialRetryTime: 3000,
          retries: 2,
          factor: 1.5,
        },
      });
    }
    return KafkaClient.instance;
  }
}
