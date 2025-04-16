import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateManutencaoDto } from '../dtos/manutencao/create-manutencao.dto';
import { ManutencaoResponseDto } from '../dtos/manutencao/manutencao-response.dto';
import { Manutencao } from '../entities/manutencao.entity';
import { VeiculoService } from './veiculo.service';

@Injectable()
export class ManutencaoService {
  constructor(
    @InjectRepository(Manutencao)
    private manutencaoRepository: Repository<Manutencao>,
    private veiculoService: VeiculoService,
  ) {}

  async criar(
    veiculoId: number,
    createManutencaoDto: CreateManutencaoDto,
  ): Promise<ManutencaoResponseDto> {
    const veiculo = await this.veiculoService.buscarPorId(veiculoId);

    const manutencao = this.manutencaoRepository.create({
      ...createManutencaoDto,
      veiculo,
    });

    const savedManutencao = await this.manutencaoRepository.save(manutencao);
    return plainToClass(ManutencaoResponseDto, savedManutencao);
  }

  async buscarTodos(): Promise<ManutencaoResponseDto[]> {
    const manutencoes = await this.manutencaoRepository.find({
      relations: ['veiculo'],
    });
    return plainToClass(ManutencaoResponseDto, manutencoes);
  }

  async buscarPorId(id: number): Promise<ManutencaoResponseDto> {
    const manutencao = await this.manutencaoRepository.findOne({
      where: { id },
      relations: ['veiculo'],
    });

    if (!manutencao) {
      throw new HttpException(
        'Manutenção não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return plainToClass(ManutencaoResponseDto, manutencao);
  }

  async buscarPorVeiculo(veiculoId: number): Promise<ManutencaoResponseDto[]> {
    await this.veiculoService.validarVeiculoExistente(veiculoId);

    const manutencoes = await this.manutencaoRepository.find({
      where: { veiculo: { id: veiculoId } },
      relations: ['veiculo'],
    });
    return plainToClass(ManutencaoResponseDto, manutencoes);
  }

  async atualizar(
    id: number,
    updateManutencaoDto: CreateManutencaoDto,
  ): Promise<ManutencaoResponseDto> {
    await this.validarManutencaoExistente(id);

    await this.manutencaoRepository.update(id, updateManutencaoDto);

    const updatedManutencao = await this.buscarPorId(id);
    return plainToClass(ManutencaoResponseDto, updatedManutencao);
  }

  async deletar(id: number): Promise<void> {
    await this.validarManutencaoExistente(id);
    await this.manutencaoRepository.delete(id);
  }

  async validarManutencaoExistente(id: number): Promise<void> {
    const manutencao = await this.manutencaoRepository.existsBy({ id });

    if (!manutencao) {
      throw new HttpException(
        'Manutenção não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
