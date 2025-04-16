import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { AbastecimentoResponseDto } from '../dtos/abastecimento/abastecimento-response.dto';
import { ManutencaoResponseDto } from '../dtos/manutencao/manutencao-response.dto';
import { CreateVeiculoDto } from '../dtos/veiculo/create-veiculo.dto';
import { VeiculoResponseDto } from '../dtos/veiculo/veiculo-response.dto';
import { Veiculo } from '../entities/veiculo.entity';

@Injectable()
export class VeiculoService {
  constructor(
    @InjectRepository(Veiculo)
    private veiculoRepository: Repository<Veiculo>,
  ) {}

  async criar(createVeiculoDto: CreateVeiculoDto): Promise<VeiculoResponseDto> {
    const veiculo = this.veiculoRepository.create(createVeiculoDto);
    const savedVeiculo = await this.veiculoRepository.save(veiculo);
    return plainToClass(VeiculoResponseDto, savedVeiculo);
  }

  async buscarTodos(): Promise<VeiculoResponseDto[]> {
    const veiculos = await this.veiculoRepository.find();
    return veiculos.map((veiculo) => plainToClass(VeiculoResponseDto, veiculo));
  }

  async buscarPorId(id: number): Promise<VeiculoResponseDto> {
    const veiculo = await this.veiculoRepository.findOne({
      where: { id },
    });

    if (!veiculo) {
      throw new HttpException('Veículo não encontrado', HttpStatus.NOT_FOUND);
    }

    return plainToClass(VeiculoResponseDto, veiculo);
  }

  async buscarAbastecimentos(id: number): Promise<AbastecimentoResponseDto[]> {
    const veiculo = await this.veiculoRepository.findOne({
      where: { id },
      relations: ['abastecimentos'],
    });

    if (!veiculo) {
      throw new HttpException('Veículo não encontrado', HttpStatus.NOT_FOUND);
    }

    return veiculo.abastecimentos.map((abastecimento) =>
      plainToClass(AbastecimentoResponseDto, abastecimento),
    );
  }

  async buscarManutencoes(id: number): Promise<ManutencaoResponseDto[]> {
    const veiculo = await this.veiculoRepository.findOne({
      where: { id },
      relations: ['manutencoes'],
    });

    if (!veiculo) {
      throw new HttpException('Veículo não encontrado', HttpStatus.NOT_FOUND);
    }

    return veiculo.manutencoes.map((manutencao) =>
      plainToClass(ManutencaoResponseDto, manutencao),
    );
  }

  async atualizar(
    id: number,
    updateVeiculoDto: CreateVeiculoDto,
  ): Promise<VeiculoResponseDto> {
    await this.validarVeiculoExistente(id);

    await this.veiculoRepository.update(id, updateVeiculoDto);

    const veiculo = await this.buscarPorId(id);

    return plainToClass(VeiculoResponseDto, veiculo);
  }

  async deletar(id: number): Promise<void> {
    await this.validarVeiculoExistente(id);

    await this.veiculoRepository.delete(id);
  }

  async validarVeiculoExistente(id: number): Promise<void> {
    const veiculo = await this.veiculoRepository.existsBy({ id: id });

    if (!veiculo) {
      throw new HttpException('Veículo não encontrado', HttpStatus.NOT_FOUND);
    }
  }
}
