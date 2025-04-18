import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVeiculoDto {
    @ApiProperty({ description: 'Marca do veículo' })
    @IsString()
    @IsNotEmpty()
    marca: string;

    @ApiProperty({ description: 'Modelo do veículo' })
    @IsString()
    @IsNotEmpty()
    modelo: string;

    @ApiProperty({ description: 'Ano de fabricação do veículo' })
    @IsNumber()
    @IsNotEmpty()
    ano: number;

    @ApiProperty({ description: 'Placa do veículo' })
    @IsString()
    @IsNotEmpty()
    placa: string;

    @ApiProperty({ description: 'Quilometragem atual do veículo' })
    @IsNumber()
    @IsNotEmpty()
    quilometragemAtual: number;
}
