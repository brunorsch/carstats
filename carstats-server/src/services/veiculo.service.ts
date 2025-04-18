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

    async criar(
        createVeiculoDto: CreateVeiculoDto,
        idUsuario: number,
    ): Promise<VeiculoResponseDto> {
        const veiculo = this.veiculoRepository.create({
            ...createVeiculoDto,
            idUsuario,
        });
        const savedVeiculo = await this.veiculoRepository.save(veiculo);
        return plainToClass(VeiculoResponseDto, savedVeiculo);
    }

    async buscarTodos(idUsuario: number): Promise<VeiculoResponseDto[]> {
        const veiculos = await this.veiculoRepository.find({
            where: { idUsuario },
        });
        return veiculos.map((veiculo) => plainToClass(VeiculoResponseDto, veiculo));
    }

    async buscarPorId(id: number, idUsuario: number): Promise<VeiculoResponseDto> {
        const veiculo = await this.veiculoRepository.findOne({
            where: { id, idUsuario },
        });

        if (!veiculo) {
            throw new HttpException('Veículo não encontrado', HttpStatus.NOT_FOUND);
        }

        return plainToClass(VeiculoResponseDto, veiculo);
    }

    async buscarAbastecimentos(id: number, idUsuario: number): Promise<AbastecimentoResponseDto[]> {
        const veiculo = await this.veiculoRepository.findOne({
            where: { id, idUsuario },
            relations: ['abastecimentos'],
        });

        if (!veiculo) {
            throw new HttpException('Veículo não encontrado', HttpStatus.NOT_FOUND);
        }

        return veiculo.abastecimentos.map((abastecimento) =>
            plainToClass(AbastecimentoResponseDto, abastecimento),
        );
    }

    async buscarManutencoes(id: number, idUsuario: number): Promise<ManutencaoResponseDto[]> {
        const veiculo = await this.veiculoRepository.findOne({
            where: { id, idUsuario },
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
        idUsuario: number,
    ): Promise<VeiculoResponseDto> {
        await this.veiculoRepository.update(id, updateVeiculoDto);

        const veiculo = await this.buscarPorId(id, idUsuario);

        return plainToClass(VeiculoResponseDto, veiculo);
    }

    async deletar(id: number, idUsuario: number): Promise<void> {
        await this.validarVeiculoExistente(id, idUsuario);

        await this.veiculoRepository.delete(id);
    }

    async validarVeiculoExistente(id: number, idUsuario: number): Promise<void> {
        const veiculo = await this.veiculoRepository.findOne({
            where: { id, idUsuario },
        });

        if (!veiculo) {
            throw new HttpException('Veículo não encontrado', HttpStatus.NOT_FOUND);
        }
    }
}
