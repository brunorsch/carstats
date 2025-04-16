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
    idUsuario: number,
  ): Promise<ManutencaoResponseDto> {
    const veiculo = await this.veiculoService.buscarPorId(veiculoId, idUsuario);

    const manutencao = this.manutencaoRepository.create({
      ...createManutencaoDto,
      veiculo,
    });

    const savedManutencao = await this.manutencaoRepository.save(manutencao);
    return plainToClass(ManutencaoResponseDto, savedManutencao);
  }

  async buscarTodos(idUsuario: number): Promise<ManutencaoResponseDto[]> {
    const manutencoes = await this.manutencaoRepository.find({
      relations: ['veiculo'],
      where: { veiculo: { idUsuario } },
    });
    return manutencoes.map((manutencao) =>
      plainToClass(ManutencaoResponseDto, manutencao),
    );
  }

  async buscarPorId(id: number, idUsuario: number): Promise<Manutencao> {
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

    // Verifica se a manutenção pertence a um veículo do usuário
    if (manutencao.veiculo.idUsuario !== idUsuario) {
      throw new HttpException('Acesso não autorizado', HttpStatus.FORBIDDEN);
    }

    return manutencao;
  }

  async buscarPorVeiculo(
    veiculoId: number,
    idUsuario: number,
  ): Promise<ManutencaoResponseDto[]> {
    await this.veiculoService.validarVeiculoExistente(veiculoId, idUsuario);

    const manutencoes = await this.manutencaoRepository.find({
      where: { veiculo: { id: veiculoId } },
    });

    return manutencoes.map((manutencao) =>
      plainToClass(ManutencaoResponseDto, manutencao),
    );
  }

  async atualizar(
    id: number,
    updateManutencaoDto: CreateManutencaoDto,
    idUsuario: number,
  ): Promise<ManutencaoResponseDto> {
    const manutencao = await this.buscarPorId(id, idUsuario);

    if (!manutencao) {
      throw new HttpException(
        'Manutenção não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    Object.assign(manutencao, updateManutencaoDto);

    const atualizada = await this.manutencaoRepository.save(manutencao);

    return plainToClass(ManutencaoResponseDto, atualizada);
  }

  async deletar(id: number, idUsuario: number): Promise<void> {
    await this.manutencaoRepository.delete({
      id,
      veiculo: { idUsuario },
    });
  }

  async validarManutencaoExistente(
    id: number,
    idUsuario: number,
  ): Promise<void> {
    const manutencao = await this.manutencaoRepository.exists({
      where: { id, veiculo: { idUsuario } },
      relations: ['veiculo'],
    });

    if (!manutencao) {
      throw new HttpException(
        'Manutenção não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
