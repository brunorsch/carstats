import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AbastecimentoResponseDto } from '../dtos/abastecimento/abastecimento-response.dto';
import { CreateAbastecimentoDto } from '../dtos/abastecimento/create-abastecimento.dto';
import { CreateManutencaoDto } from '../dtos/manutencao/create-manutencao.dto';
import { ManutencaoResponseDto } from '../dtos/manutencao/manutencao-response.dto';
import { CreateVeiculoDto } from '../dtos/veiculo/create-veiculo.dto';
import { VeiculoResponseDto } from '../dtos/veiculo/veiculo-response.dto';
import { AbastecimentoService } from '../services/abastecimento.service';
import { ManutencaoService } from '../services/manutencao.service';
import { VeiculoService } from '../services/veiculo.service';

@ApiTags('Veículos')
@Controller('veiculos')
export class VeiculoController {
  constructor(
    private readonly veiculoService: VeiculoService,
    private readonly manutencaoService: ManutencaoService,
    private readonly abastecimentoService: AbastecimentoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo veículo' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Veículo criado com sucesso',
    type: VeiculoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async criar(
    @Body() createVeiculoDto: CreateVeiculoDto,
    @Req() req: Request,
  ): Promise<VeiculoResponseDto> {
    const idUsuario = req.usuario.id;
    return await this.veiculoService.criar(createVeiculoDto, idUsuario);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os veículos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de veículos retornada com sucesso',
    type: [VeiculoResponseDto],
  })
  async buscarTodos(@Req() req: Request): Promise<VeiculoResponseDto[]> {
    const idUsuario = req.usuario.id;
    return await this.veiculoService.buscarTodos(idUsuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar veículo por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Veículo encontrado com sucesso',
    type: VeiculoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  async buscarPorId(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<VeiculoResponseDto> {
    const idUsuario = req.usuario.id;
    return await this.veiculoService.buscarPorId(id, idUsuario);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um veículo' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Veículo atualizado com sucesso',
    type: VeiculoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  async atualizar(
    @Param('id') id: number,
    @Body() updateVeiculoDto: CreateVeiculoDto,
    @Req() req: Request,
  ): Promise<VeiculoResponseDto> {
    const idUsuario = req.usuario.id;
    return await this.veiculoService.atualizar(id, updateVeiculoDto, idUsuario);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um veículo' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Veículo deletado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  async deletar(@Param('id') id: number, @Req() req: Request): Promise<void> {
    const idUsuario = req.usuario.id;
    await this.veiculoService.deletar(id, idUsuario);
  }

  @Post(':id/manutencoes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adicionar manutenção a um veículo' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Manutenção adicionada com sucesso',
    type: ManutencaoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  async criarManutencao(
    @Param('id') veiculoId: number,
    @Body() createManutencaoDto: CreateManutencaoDto,
    @Req() req: Request,
  ): Promise<ManutencaoResponseDto> {
    const idUsuario = req.usuario.id;
    await this.veiculoService.validarVeiculoExistente(veiculoId, idUsuario);
    return await this.manutencaoService.criar(
      veiculoId,
      createManutencaoDto,
      idUsuario,
    );
  }

  @Get(':id/manutencoes')
  @ApiOperation({ summary: 'Listar manutenções de um veículo' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de manutenções retornada com sucesso',
    type: [ManutencaoResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  async buscarManutencoes(
    @Param('id') veiculoId: number,
    @Req() req: Request,
  ): Promise<ManutencaoResponseDto[]> {
    const idUsuario = req.usuario.id;
    return await this.veiculoService.buscarManutencoes(veiculoId, idUsuario);
  }

  @Post(':id/abastecimentos')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adicionar abastecimento a um veículo' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Abastecimento adicionado com sucesso',
    type: AbastecimentoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  async criarAbastecimento(
    @Param('id') veiculoId: number,
    @Body() createAbastecimentoDto: CreateAbastecimentoDto,
    @Req() req: Request,
  ): Promise<AbastecimentoResponseDto> {
    const idUsuario = req.usuario.id;
    await this.veiculoService.validarVeiculoExistente(veiculoId, idUsuario);
    return await this.abastecimentoService.criar(
      veiculoId,
      createAbastecimentoDto,
      idUsuario,
    );
  }

  @Get(':id/abastecimentos')
  @ApiOperation({ summary: 'Listar abastecimentos de um veículo' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de abastecimentos retornada com sucesso',
    type: [AbastecimentoResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  async buscarAbastecimentos(
    @Param('id') veiculoId: number,
    @Req() req: Request,
  ): Promise<AbastecimentoResponseDto[]> {
    const idUsuario = req.usuario.id;
    return await this.veiculoService.buscarAbastecimentos(veiculoId, idUsuario);
  }
}
