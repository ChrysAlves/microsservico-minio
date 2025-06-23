export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  groupId: string;
}

export const getKafkaConfig = (): KafkaConfig => {
  return {
    clientId: process.env.KAFKA_CLIENT_ID || process.env.KAFKA_CLIENT_ID,
    brokers: (process.env.KAFKA_BROKERS || process.env.KAFKA_BROKER).split(','),
    groupId: process.env.KAFKA_GROUP_ID || process.env.KAFKA_GROUP_ID,
  };
};
