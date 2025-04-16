import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { AbastecimentoResponseDto } from '../dtos/abastecimento/abastecimento-response.dto';
import { CreateAbastecimentoDto } from '../dtos/abastecimento/create-abastecimento.dto';
import { Abastecimento } from '../entities/abastecimento.entity';
import { VeiculoService } from './veiculo.service';

@Injectable()
export class AbastecimentoService {
  constructor(
    @InjectRepository(Abastecimento)
    private abastecimentoRepository: Repository<Abastecimento>,
    private veiculoService: VeiculoService,
  ) {}

  async criar(
    veiculoId: number,
    createAbastecimentoDto: CreateAbastecimentoDto,
  ): Promise<AbastecimentoResponseDto> {
    const veiculo =
      await this.veiculoService.validarVeiculoExistente(veiculoId);

    const abastecimento = this.abastecimentoRepository.create({
      ...createAbastecimentoDto,
      veiculo,
    });

    const savedAbastecimento =
      await this.abastecimentoRepository.save(abastecimento);
    return plainToClass(AbastecimentoResponseDto, savedAbastecimento);
  }

  async buscarTodos(): Promise<AbastecimentoResponseDto[]> {
    const abastecimentos = await this.abastecimentoRepository.find({
      relations: ['veiculo'],
    });
    return plainToClass(AbastecimentoResponseDto, abastecimentos);
  }

  async buscarPorId(id: number): Promise<AbastecimentoResponseDto> {
    const abastecimento = await this.abastecimentoRepository.findOne({
      where: { id },
      relations: ['veiculo'],
    });

    if (!abastecimento) {
      throw new HttpException(
        'Abastecimento não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return plainToClass(AbastecimentoResponseDto, abastecimento);
  }

  async buscarPorVeiculo(
    veiculoId: number,
  ): Promise<AbastecimentoResponseDto[]> {
    await this.veiculoService.validarVeiculoExistente(veiculoId);

    const abastecimentos = await this.abastecimentoRepository.find({
      where: { veiculo: { id: veiculoId } },
      relations: ['veiculo'],
    });

    return plainToClass(AbastecimentoResponseDto, abastecimentos);
  }

  async atualizar(
    id: number,
    updateAbastecimentoDto: CreateAbastecimentoDto,
  ): Promise<AbastecimentoResponseDto> {
    await this.validarAbastecimentoExistente(id);

    await this.abastecimentoRepository.update(id, updateAbastecimentoDto);

    const updatedAbastecimento = await this.buscarPorId(id);
    return plainToClass(AbastecimentoResponseDto, updatedAbastecimento);
  }

  async deletar(id: number): Promise<void> {
    await this.validarAbastecimentoExistente(id);
    await this.abastecimentoRepository.delete(id);
  }

  async validarAbastecimentoExistente(id: number): Promise<Abastecimento> {
    const abastecimento = await this.abastecimentoRepository.findOne({
      where: { id },
    });

    if (!abastecimento) {
      throw new HttpException(
        'Abastecimento não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return abastecimento;
  }
}
