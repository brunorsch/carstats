import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { AppException } from 'src/support/exceptions/app.exception';
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

    async cadastrar(
        idVeiculo: number,
        request: CreateAbastecimentoDto,
        idUsuario: number,
    ): Promise<AbastecimentoResponseDto> {
        if (!request.litros && !request.valorTotal) {
            throw exceptions.litrosOuValorTotalAusente();
        }

        const veiculo = await this.veiculoService.buscarPorId(idVeiculo, idUsuario);
        const novoAbastecimento = this.abastecimentoRepository.create({
            ...request,
            veiculo,
        });

        this.calcularValorTotalELitros(request, novoAbastecimento);

        if (novoAbastecimento.isTanqueCompletado) {
            await this.atualizarConsumo(novoAbastecimento);
        } else {
            await this.registrarQuilometragem(novoAbastecimento);
        }

        return await this.abastecimentoRepository.save(novoAbastecimento);
    }

    private calcularValorTotalELitros(
        request: CreateAbastecimentoDto,
        abastecimento: Abastecimento,
    ) {
        if (request.valorTotal && !abastecimento.litros) {
            abastecimento.litros = request.valorTotal / request.valorPorLitro;
        }

        if (request.litros && !request.valorTotal) {
            abastecimento.valorTotal = request.litros * request.valorPorLitro;
        }
    }

    private async atualizarConsumo(novoAbastecimento: Abastecimento) {
        const idVeiculo = novoAbastecimento.veiculo.id;
        const idUsuario = novoAbastecimento.veiculo.idUsuario;

        if (await this.consultarUltimoAbastecimento(idVeiculo)) {
            const ultimoAbastecimento = await this.consultarUltimoAbastecimento(idVeiculo);
            const isUltimoAbastecimentoCompleto = ultimoAbastecimento?.isTanqueCompletado ?? false;

            if (isUltimoAbastecimentoCompleto) {
                const kmNovoAbastecimento = novoAbastecimento.quilometragem;
                const kmUltimoAbastecimento = ultimoAbastecimento!.quilometragem;
                const litrosAbastecidos = novoAbastecimento.litros;

                novoAbastecimento.veiculo.registrarDadosAbastecimentoCompleto(
                    kmNovoAbastecimento,
                    kmUltimoAbastecimento,
                    litrosAbastecidos,
                );

                await this.veiculoService.atualizarValidandoPermissao(
                    idVeiculo,
                    idUsuario,
                    novoAbastecimento.veiculo,
                );
            }
        }
    }

    private async consultarUltimoAbastecimento(veiculoId: number): Promise<Abastecimento | null> {
        return await this.abastecimentoRepository
            .createQueryBuilder()
            .where('abastecimento.veiculo_id = :veiculoId', { veiculoId })
            .orderBy('abastecimento.data_abastecimento', 'DESC')
            .getOne();
    }

    private async registrarQuilometragem(abastecimento: Abastecimento) {
        const veiculo = await this.veiculoService.buscarPorId(
            abastecimento.veiculo.id,
            abastecimento.veiculo.idUsuario,
        );

        veiculo.quilometragemAtual = abastecimento.quilometragem;

        await this.veiculoService.atualizarValidandoPermissao(
            veiculo.id,
            veiculo.idUsuario,
            veiculo,
        );
    }

    async buscarPorId(id: number, idUsuario: number): Promise<AbastecimentoResponseDto> {
        const abastecimento = await this.abastecimentoRepository.findOne({
            where: { id },
            relations: ['veiculo'],
        });

        if (!abastecimento) {
            throw new HttpException('Abastecimento não encontrado', HttpStatus.NOT_FOUND);
        }

        if (abastecimento.veiculo.idUsuario !== idUsuario) {
            throw new HttpException('Acesso não autorizado', HttpStatus.FORBIDDEN);
        }

        return plainToClass(AbastecimentoResponseDto, abastecimento);
    }

    async buscarPorVeiculo(idVeiculo: number): Promise<AbastecimentoResponseDto[]> {
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
        request: CreateAbastecimentoDto,
        idUsuario: number,
    ): Promise<AbastecimentoResponseDto> {
        await this.validarAbastecimentoExistente(id, idUsuario);

        await this.abastecimentoRepository.update(id, request);

        const updatedAbastecimento = await this.buscarPorId(id, idUsuario);
        return plainToClass(AbastecimentoResponseDto, updatedAbastecimento);
    }

    async deletar(id: number, idUsuario: number): Promise<void> {
        await this.validarAbastecimentoExistente(id, idUsuario);
        await this.abastecimentoRepository.delete(id);
    }

    async validarAbastecimentoExistente(id: number, idUsuario: number): Promise<void> {
        const abastecimento = await this.abastecimentoRepository.existsBy({
            id,
            veiculo: { idUsuario },
        });

        if (!abastecimento) {
            throw new HttpException('Abastecimento não encontrado', HttpStatus.NOT_FOUND);
        }
    }
}

const exceptions = {
    litrosOuValorTotalAusente: () =>
        new AppException(
            'LITROS_VALOR_TOTAL_AUSENTES',
            'Ao menos um dos campos: "Litros" ou "Valor total do abastecimento" devem ser preenchidos',
            HttpStatus.BAD_REQUEST,
        ),
};
