import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
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
    status: HttpStatus.OK,
    description: 'Abastecimento encontrado com sucesso',
    type: AbastecimentoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Abastecimento não encontrado' })
  async buscarPorId(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<AbastecimentoResponseDto> {
    const idUsuario = req.usuario.id;
    return await this.abastecimentoService.buscarPorId(id, idUsuario);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um abastecimento' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Abastecimento atualizado com sucesso',
    type: AbastecimentoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Abastecimento não encontrado' })
  async atualizar(
    @Param('id') id: number,
    @Body() updateAbastecimentoDto: CreateAbastecimentoDto,
    @Req() req: Request,
  ): Promise<AbastecimentoResponseDto> {
    const idUsuario = req.usuario.id;
    return await this.abastecimentoService.atualizar(
      id,
      updateAbastecimentoDto,
      idUsuario,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um abastecimento' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Abastecimento deletado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Abastecimento não encontrado' })
  async deletar(@Param('id') id: number, @Req() req: Request): Promise<void> {
    const idUsuario = req.usuario.id;
    await this.abastecimentoService.deletar(id, idUsuario);
  }
}
