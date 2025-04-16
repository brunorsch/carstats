import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AbastecimentoResponseDto } from '../dtos/abastecimento/abastecimento-response.dto';
import { CreateAbastecimentoDto } from '../dtos/abastecimento/create-abastecimento.dto';
import { AbastecimentoService } from '../services/abastecimento.service';

@ApiTags('Abastecimentos')
@Controller('abastecimentos')
export class AbastecimentoController {
  constructor(private readonly abastecimentoService: AbastecimentoService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Buscar abastecimento por ID' })
  @ApiResponse({
    status: 200,
    description: 'Abastecimento encontrado',
    type: AbastecimentoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Abastecimento não encontrado' })
  async buscarPorId(
    @Param('id') id: number,
  ): Promise<AbastecimentoResponseDto> {
    return await this.abastecimentoService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um abastecimento' })
  @ApiResponse({
    status: 200,
    description: 'Abastecimento atualizado com sucesso',
    type: AbastecimentoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Abastecimento não encontrado' })
  async atualizar(
    @Param('id') id: number,
    @Body() updateAbastecimentoDto: CreateAbastecimentoDto,
  ): Promise<AbastecimentoResponseDto> {
    return await this.abastecimentoService.atualizar(
      id,
      updateAbastecimentoDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um abastecimento' })
  @ApiResponse({
    status: 200,
    description: 'Abastecimento deletado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Abastecimento não encontrado' })
  async deletar(@Param('id') id: number): Promise<void> {
    await this.abastecimentoService.deletar(id);
  }
}
