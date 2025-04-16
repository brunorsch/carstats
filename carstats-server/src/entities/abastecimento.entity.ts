import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  consumo: number;

  @ManyToOne(() => Veiculo, (veiculo: Veiculo) => veiculo.abastecimentos)
  veiculo: Veiculo;
}
