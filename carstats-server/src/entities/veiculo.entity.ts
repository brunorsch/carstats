import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Abastecimento } from './abastecimento.entity';
import { Manutencao } from './manutencao.entity';

@Entity()
export class Veiculo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    idUsuario: number;

    @Column()
    marca: string;

    @Column()
    modelo: string;

    @Column()
    ano: number;

    @Column()
    placa: string;

    @Column({ type: 'decimal', precision: 10, default: 0 })
    quilometragemAtual: number;

    @OneToMany(() => Abastecimento, (abastecimento) => abastecimento.veiculo)
    abastecimentos: Abastecimento[];

    @OneToMany(() => Manutencao, (manutencao) => manutencao.veiculo)
    manutencoes: Manutencao[];

    @Column({ default: 0 })
    consumoCalculado: number = 0;

    constructor(partial?: Partial<Veiculo>) {
        Object.assign(this, partial);
    }

    registrarDadosAbastecimentoCompleto(
        novaQuilometragem: number,
        quilometragemAntiga: number,
        litros: number,
    ) {
        const distancia = novaQuilometragem - quilometragemAntiga;
        const consumo = distancia / litros;

        this.quilometragemAtual = novaQuilometragem;
        this.consumoCalculado = consumo;
    }
}
