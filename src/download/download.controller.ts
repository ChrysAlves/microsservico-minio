import { Controller, Get, Param, Res } from '@nestjs/common';
import { DownloadService } from './download.service';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'; // Importações adicionadas

@ApiTags('Download') // Tag para agrupar no Swagger UI
@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get('presigned/:key')
  @ApiOperation({ summary: 'Gera uma URL pré-assinada para download de arquivo' })
  @ApiParam({ name: 'key', description: 'Chave (nome) do arquivo para gerar a URL', type: String })
  @ApiResponse({ status: 200, description: 'URL pré-assinada gerada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Arquivo não encontrado para gerar a URL.' })
  async gerarPresigned(@Param('key') key: string) {
    const url = await this.downloadService.gerarPresignedUrl(key);
    return { url };
  }

  @Get(':key')
  @ApiOperation({ summary: 'Faz o download de um arquivo pelo nome' })
  @ApiParam({ name: 'key', description: 'Chave (nome) do arquivo para download', type: String })
  @ApiResponse({ status: 200, description: 'Arquivo retornado como stream.' })
  @ApiResponse({ status: 404, description: 'Arquivo não encontrado no bucket.' })
  async getFile(
    @Param('key') key: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.downloadService.downloadFile(key);
    res.set({
      'Content-Type': file.getHeaders().type,
      'Content-Disposition': file.getHeaders().disposition,
    });
    return file;
  }
}