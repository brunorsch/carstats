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
    idVeiculo: number,
    createAbastecimentoDto: CreateAbastecimentoDto,
    idUsuario: number,
  ): Promise<AbastecimentoResponseDto> {
    const veiculo = await this.veiculoService.buscarPorId(idVeiculo, idUsuario);

    const abastecimento = this.abastecimentoRepository.create({
      ...createAbastecimentoDto,
      veiculo,
    });

    const novo = await this.abastecimentoRepository.save(abastecimento);
    return plainToClass(AbastecimentoResponseDto, novo);
  }

  async buscarPorId(
    id: number,
    idUsuario: number,
  ): Promise<AbastecimentoResponseDto> {
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

    if (abastecimento.veiculo.idUsuario !== idUsuario) {
      throw new HttpException('Acesso não autorizado', HttpStatus.FORBIDDEN);
    }

    return plainToClass(AbastecimentoResponseDto, abastecimento);
  }

  async buscarPorVeiculo(
    idVeiculo: number,
  ): Promise<AbastecimentoResponseDto[]> {
    const abastecimentos = await this.abastecimentoRepository.find({
      where: { veiculo: { id: idVeiculo } },
      relations: ['veiculo'],
    });

    return abastecimentos.map((abastecimento) =>
      plainToClass(AbastecimentoResponseDto, abastecimento),
    );
  }

  async atualizar(
    id: number,
    updateAbastecimentoDto: CreateAbastecimentoDto,
    idUsuario: number,
  ): Promise<AbastecimentoResponseDto> {
    await this.validarAbastecimentoExistente(id, idUsuario);

    await this.abastecimentoRepository.update(id, updateAbastecimentoDto);

    const updatedAbastecimento = await this.buscarPorId(id, idUsuario);
    return plainToClass(AbastecimentoResponseDto, updatedAbastecimento);
  }

  async deletar(id: number, idUsuario: number): Promise<void> {
    await this.validarAbastecimentoExistente(id, idUsuario);
    await this.abastecimentoRepository.delete(id);
  }

  async validarAbastecimentoExistente(
    id: number,
    idUsuario: number,
  ): Promise<void> {
    const abastecimento = await this.abastecimentoRepository.existsBy({
      id,
      veiculo: { idUsuario },
    });

    if (!abastecimento) {
      throw new HttpException(
        'Abastecimento não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
