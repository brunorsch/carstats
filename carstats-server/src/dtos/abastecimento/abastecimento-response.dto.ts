import { ApiProperty } from '@nestjs/swagger';

export class AbastecimentoResponseDto {
    @ApiProperty({ description: 'ID do abastecimento' })
    id: number;

    @ApiProperty({ description: 'Data do abastecimento' })
    data: Date;

    @ApiProperty({ description: 'Quantidade de litros abastecidos' })
    litros: number;

    @ApiProperty({ description: 'Valor por litro do combustível' })
    valorPorLitro: number;

    @ApiProperty({ description: 'Valor total do abastecimento' })
    valorTotal: number;

    @ApiProperty({
        description: 'Quilometragem do veículo no momento do abastecimento',
    })
    quilometragem: number;

    @ApiProperty({
        description: 'Consumo médio calculado (km/l)',
        required: false,
    })
    consumo?: number;
}
