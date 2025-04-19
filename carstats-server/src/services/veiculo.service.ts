import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { AppException } from 'src/support/exceptions/app.exception';
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

    async buscarPorId(id: number, idUsuario: number): Promise<Veiculo> {
        const veiculo = await this.veiculoRepository.findOne({
            where: { id, idUsuario },
        });

        if (!veiculo) {
            throw new HttpException('Veículo não encontrado', HttpStatus.NOT_FOUND);
        }

        return veiculo;
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

    async atualizar(id: number, request: CreateVeiculoDto, idUsuario: number): Promise<Veiculo> {
        await this.atualizarValidandoPermissao(id, idUsuario, plainToClass(Veiculo, request));

        return await this.buscarPorId(id, idUsuario);
    }

    async atualizarValidandoPermissao(
        id: number,
        idUsuario: number,
        veiculoAtualizado: Partial<Veiculo>,
    ) {
        await this.validarPossePorUsuario(id, idUsuario);

        await this.veiculoRepository.update(id, veiculoAtualizado);
    }

    async deletar(id: number, idUsuario: number): Promise<void> {
        await this.validarVeiculoExistente(id, idUsuario);

        await this.veiculoRepository.delete(id);
    }

    async validarVeiculoExistente(id: number, idUsuario: number): Promise<void> {
        if (!(await this.existePorIdEUsuario(id, idUsuario))) {
            throw exceptions.veiculoNaoEncontrado();
        }
    }

    private async validarPossePorUsuario(id: number, idUsuario: number): Promise<void> {
        if (!(await this.existePorIdEUsuario(id, idUsuario))) {
            throw exceptions.semPermissao();
        }
    }

    private async existePorIdEUsuario(id: number, idUsuario: number): Promise<boolean> {
        const veiculo = await this.veiculoRepository.existsBy({
            id,
            idUsuario,
        });

        return veiculo;
    }
}

const exceptions = {
    veiculoNaoEncontrado: () =>
        new AppException('VEICULO_NAO_ENCONTRADO', 'Veículo não encontrado', HttpStatus.NOT_FOUND),
    semPermissao: () =>
        new AppException(
            'SEM_PERMISSAO',
            'Você não tem permissão para acessar o recurso',
            HttpStatus.FORBIDDEN,
        ),
};
