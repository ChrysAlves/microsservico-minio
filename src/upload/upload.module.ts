import { forwardRef, Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { KafkaModule } from 'src/messaging/kafka.module';

@Module({
  imports: [forwardRef(() => KafkaModule)],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
