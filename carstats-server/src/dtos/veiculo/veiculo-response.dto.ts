import { ApiProperty } from '@nestjs/swagger';
import { AbastecimentoResponseDto } from '../abastecimento/abastecimento-response.dto';
import { ManutencaoResponseDto } from '../manutencao/manutencao-response.dto';

export class VeiculoResponseDto {
  @ApiProperty({ description: 'ID do veículo' })
  id: number;

  @ApiProperty({ description: 'Marca do veículo' })
  marca: string;

  @ApiProperty({ description: 'Modelo do veículo' })
  modelo: string;

  @ApiProperty({ description: 'Ano de fabricação do veículo' })
  ano: number;

  @ApiProperty({ description: 'Placa do veículo' })
  placa: string;

  @ApiProperty({ description: 'Quilometragem atual do veículo' })
  quilometragemAtual: number;

  @ApiProperty({
    type: [AbastecimentoResponseDto],
    description: 'Lista de abastecimentos do veículo',
  })
  abastecimentos?: AbastecimentoResponseDto[];

  @ApiProperty({
    type: [ManutencaoResponseDto],
    description: 'Lista de manutenções do veículo',
  })
  manutencoes?: ManutencaoResponseDto[];
}
