import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Abastecimento } from './abastecimento.entity';
import { Manutencao } from './manutencao.entity';

@Entity()
export class Veiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column()
  ano: number;

  @Column()
  placa: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quilometragemAtual: number;

  @OneToMany(() => Abastecimento, (abastecimento) => abastecimento.veiculo)
  abastecimentos: Abastecimento[];

  @OneToMany(() => Manutencao, (manutencao) => manutencao.veiculo)
  manutencoes: Manutencao[];
}
