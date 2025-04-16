import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManutencaoDto } from '../dtos/manutencao/create-manutencao.dto';
import { ManutencaoResponseDto } from '../dtos/manutencao/manutencao-response.dto';
import { ManutencaoService } from '../services/manutencao.service';

@ApiTags('Manutenções')
@Controller('manutencoes')
export class ManutencaoController {
  constructor(private readonly manutencaoService: ManutencaoService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Buscar manutenção por ID' })
  @ApiResponse({
    status: 200,
    description: 'Manutenção encontrada',
    type: ManutencaoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Manutenção não encontrada' })
  async buscarPorId(@Param('id') id: number): Promise<ManutencaoResponseDto> {
    return await this.manutencaoService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma manutenção' })
  @ApiResponse({
    status: 200,
    description: 'Manutenção atualizada com sucesso',
    type: ManutencaoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Manutenção não encontrada' })
  async atualizar(
    @Param('id') id: number,
    @Body() updateManutencaoDto: CreateManutencaoDto,
  ): Promise<ManutencaoResponseDto> {
    return await this.manutencaoService.atualizar(id, updateManutencaoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma manutenção' })
  @ApiResponse({ status: 200, description: 'Manutenção deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Manutenção não encontrada' })
  async deletar(@Param('id') id: number): Promise<void> {
    await this.manutencaoService.deletar(id);
  }
}
