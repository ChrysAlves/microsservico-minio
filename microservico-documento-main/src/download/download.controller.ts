import { Controller, Get, Param, Res } from '@nestjs/common';
import { DownloadService } from './download.service';
import { Response } from 'express';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get('presigned/:key')
  async gerarPresigned(@Param('key') key: string) {
    const url = await this.downloadService.gerarPresignedUrl(key);
    return { url };
  }

  @Get(':key') // key é o nome do arquivo
  async getFile(
    @Param('key') key: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.downloadService.downloadFile(key);
    res.set({
      'Content-Type': file.getHeaders().type, // tipo do arquivo
      'Content-Disposition': file.getHeaders().disposition, // cm o navegador deve tratar o arquivo
    });
    return file;
  }
}
