import { Controller, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common'; //
import { DeleteService } from './delete.service'; //

@Controller('delete') //
export class DeleteController {
  constructor(private readonly deleteService: DeleteService) {} //

  @Delete(':key') // Endpoint DELETE, por exemplo: DELETE /delete/meu-arquivo.txt
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content para indicar sucesso na deleção
  async deleteFile(@Param('key') key: string): Promise<void> { //
    await this.deleteService.deleteFile(key); //
  }
}