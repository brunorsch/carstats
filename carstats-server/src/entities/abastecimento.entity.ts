import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Veiculo } from './veiculo.entity';

@Entity()
export class Abastecimento {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    data: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    litros: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    valorPorLitro: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    valorTotal: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quilometragem: number;

    @Column()
    isTanqueCompletado: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    consumoCalculado?: number;

    @ManyToOne(() => Veiculo, (veiculo: Veiculo) => veiculo.abastecimentos)
    veiculo: Veiculo;
}
