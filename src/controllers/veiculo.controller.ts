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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Criar um novo veículo' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Veículo criado com sucesso',
    type: VeiculoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async criar(
    @Body() createVeiculoDto: CreateVeiculoDto,
  ): Promise<VeiculoResponseDto> {
    return await this.veiculoService.criar(createVeiculoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os veículos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de veículos retornada com sucesso',
    type: [VeiculoResponseDto],
  })
  async buscarTodos(): Promise<VeiculoResponseDto[]> {
    return await this.veiculoService.buscarTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um veículo pelo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Veículo encontrado com sucesso',
    type: VeiculoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  async buscarPorId(@Param('id') id: number): Promise<VeiculoResponseDto> {
    return await this.veiculoService.buscarPorId(id);
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
  ): Promise<VeiculoResponseDto> {
    return await this.veiculoService.atualizar(id, updateVeiculoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um veículo' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Veículo deletado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  async deletar(@Param('id') id: number): Promise<void> {
    await this.veiculoService.deletar(id);
  }

  @Post(':id/manutencoes')
  @ApiOperation({ summary: 'Criar uma nova manutenção para o veículo' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Manutenção criada com sucesso',
    type: ManutencaoResponseDto,
  })
  async criarManutencao(
    @Param('id') veiculoId: number,
    @Body() createManutencaoDto: CreateManutencaoDto,
  ): Promise<ManutencaoResponseDto> {
    return this.manutencaoService.criar(veiculoId, createManutencaoDto);
  }

  @Get(':id/manutencoes')
  @ApiOperation({ summary: 'Buscar manutenções do veículo' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de manutenções do veículo',
    type: [ManutencaoResponseDto],
  })
  async buscarManutencoes(
    @Param('id') veiculoId: number,
  ): Promise<ManutencaoResponseDto[]> {
    return this.manutencaoService.buscarPorVeiculo(veiculoId);
  }

  @Post(':id/abastecimentos')
  @ApiOperation({
    summary: 'Salvar novo histórico de abastecimento para o veículo',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Abastecimento criado com sucesso',
    type: AbastecimentoResponseDto,
  })
  async criarAbastecimento(
    @Param('id') veiculoId: number,
    @Body() createAbastecimentoDto: CreateAbastecimentoDto,
  ): Promise<AbastecimentoResponseDto> {
    return this.abastecimentoService.criar(veiculoId, createAbastecimentoDto);
  }

  @Get(':id/abastecimentos')
  @ApiOperation({ summary: 'Buscar abastecimentos do veículo' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de abastecimentos do veículo',
    type: [AbastecimentoResponseDto],
  })
  async buscarAbastecimentos(
    @Param('id') veiculoId: number,
  ): Promise<AbastecimentoResponseDto[]> {
    return this.abastecimentoService.buscarPorVeiculo(veiculoId);
  }
}
