import { ApiProperty } from '@nestjs/swagger';

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
}
