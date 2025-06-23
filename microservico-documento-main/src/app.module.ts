import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DownloadModule } from './download/download.module';
import { UploadModule } from './upload/upload.module';
import { KafkaModule } from './messaging/kafka.module';
import { DeleteModule } from './delete/delete.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env', 
    }),
    UploadModule,
    DownloadModule,
    KafkaModule,
    DeleteModule,
  ],
})
export class AppModule {}
