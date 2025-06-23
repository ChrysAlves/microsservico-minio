import { Controller, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { DeleteService } from './delete.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'; // Importações adicionadas

@ApiTags('Delete') // Tag para agrupar no Swagger UI
@Controller('delete')
export class DeleteController {
  constructor(private readonly deleteService: DeleteService) {}

  @Delete(':key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleta um arquivo do bucket' }) // Descrição da operação
  @ApiParam({ name: 'key', description: 'Chave (nome) do arquivo a ser deletado', type: String }) // Parâmetro :key
  @ApiResponse({ status: 204, description: 'Arquivo deletado com sucesso.' }) // Resposta de sucesso
  @ApiResponse({ status: 404, description: 'Não foi possível deletar o arquivo (arquivo não encontrado ou outro erro).' }) // Possível erro
  async deleteFile(@Param('key') key: string): Promise<void> {
    await this.deleteService.deleteFile(key);
  }
}