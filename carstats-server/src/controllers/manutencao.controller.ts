import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
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
    status: HttpStatus.OK,
    description: 'Manutenção encontrada com sucesso',
    type: ManutencaoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Manutenção não encontrada' })
  async buscarPorId(
    @Param('id') id: number,
    @Headers('x-user-id') idUsuario: number,
  ): Promise<ManutencaoResponseDto> {
    const manutencao = await this.manutencaoService.buscarPorId(id, idUsuario);
    return plainToClass(ManutencaoResponseDto, manutencao);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma manutenção' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Manutenção atualizada com sucesso',
    type: ManutencaoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Manutenção não encontrada' })
  async atualizar(
    @Param('id') id: number,
    @Body() updateManutencaoDto: CreateManutencaoDto,
    @Headers('x-user-id') idUsuario: number,
  ): Promise<ManutencaoResponseDto> {
    return await this.manutencaoService.atualizar(
      id,
      updateManutencaoDto,
      idUsuario,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar uma manutenção' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Manutenção deletada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Manutenção não encontrada' })
  async deletar(
    @Param('id') id: number,
    @Headers('x-user-id') idUsuario: number,
  ): Promise<void> {
    await this.manutencaoService.deletar(id, idUsuario);
  }
}
