import { Controller, Get, Query } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger'; // Importações adicionadas
// import { response } from 'express'; // Este 'response' não está sendo usado, pode ser removido

@ApiTags('Upload') // Tag para agrupar no Swagger UI
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get('from-url')
  @ApiOperation({ summary: 'Faz upload de um arquivo a partir de uma URL externa' })
  @ApiQuery({ name: 'url', description: 'URL do arquivo externo para download', type: String })
  @ApiQuery({ name: 'filename', description: 'Nome a ser dado ao arquivo no bucket', type: String })
  @ApiQuery({ name: 'token', description: 'Token de autenticação/contexto', type: String })
  @ApiQuery({ name: 'response_require_by', description: 'Serviço que requisitou o upload', type: String })
  @ApiResponse({ status: 200, description: 'Arquivo enviado com sucesso.' })
  @ApiResponse({ status: 500, description: 'Falha no download ou upload do arquivo.' })
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