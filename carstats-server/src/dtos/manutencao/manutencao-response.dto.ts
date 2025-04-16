import { ApiProperty } from '@nestjs/swagger';

export class ManutencaoResponseDto {
  @ApiProperty({ description: 'ID da manutenção' })
  id: number;

  @ApiProperty({ description: 'Data da manutenção' })
  data: Date;

  @ApiProperty({ description: 'Descrição da manutenção realizada' })
  descricao: string;

  @ApiProperty({ description: 'Valor total da manutenção' })
  valor: number;

  @ApiProperty({
    description: 'Quilometragem do veículo no momento da manutenção',
  })
  quilometragem: number;

  @ApiProperty({ description: 'Nome do prestador de serviço', required: false })
  prestadorServico?: string;

  @ApiProperty({
    description: 'Observações adicionais sobre a manutenção',
    required: false,
  })
  observacoes?: string;
}
