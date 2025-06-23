import { Controller, Get, Query } from '@nestjs/common';
import { UploadService } from './upload.service';
import { response } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('from-url')
  async uploadFromUrl(
    @Query('url') url: string,
    @Query('filename') filename: string,
    @Query('token') token: string,
    @Query('response_require_by') response_require_by: string,
  ) {
    return this.uploadService.handleFile(
      url,
      filename,
      token,
      response_require_by,
    );
  }
}
