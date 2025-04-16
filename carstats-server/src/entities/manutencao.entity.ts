import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Veiculo } from './veiculo.entity';

@Entity()
export class Manutencao {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  data: Date;

  @Column()
  descricao: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column({ type: 'int' })
  quilometragem: number;

  @Column({ nullable: true })
  prestadorServico: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @ManyToOne(() => Veiculo, (veiculo) => veiculo.manutencoes)
  veiculo: Veiculo;
}
