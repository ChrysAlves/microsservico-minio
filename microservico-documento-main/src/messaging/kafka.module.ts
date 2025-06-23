import { forwardRef, Module } from '@nestjs/common';
import { ArquivoConsume } from 'src/consumer/arquivo.consume';
import { KafkaConsumerService } from 'src/core/kafka/kafka.consumer';
import { KafkaProducerService } from 'src/core/kafka/kafka.producer';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [forwardRef(() => UploadModule)],
  providers: [KafkaProducerService, KafkaConsumerService, ArquivoConsume],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}
