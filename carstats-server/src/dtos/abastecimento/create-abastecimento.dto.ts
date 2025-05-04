import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAbastecimentoDto {
    @ApiProperty({ description: 'Quantidade de litros abastecidos' })
    @IsNumber()
    @IsNotEmpty()
    litros?: number;

    @ApiProperty({ description: 'Valor por litro do combustível' })
    @IsNumber()
    @IsNotEmpty()
    valorPorLitro: number;

    @ApiProperty({ description: 'Valor total do abastecimento' })
    @IsNumber()
    @IsNotEmpty()
    valorTotal?: number;

    @ApiProperty({
        description: 'Quilometragem do veículo no momento do abastecimento',
    })
    @IsNumber()
    @IsNotEmpty()
    quilometragem: number;

    @ApiProperty({
        description: 'Flag indicando se o tanque foi completado',
        required: true,
    })
    isTanqueCompletado: boolean = false;
}
