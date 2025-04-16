import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateManutencaoDto {
  @ApiProperty({ description: 'Descrição da manutenção realizada' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ description: 'Valor total da manutenção' })
  @IsNumber()
  @IsNotEmpty()
  valor: number;

  @ApiProperty({
    description: 'Quilometragem do veículo no momento da manutenção',
  })
  @IsNumber()
  @IsNotEmpty()
  quilometragem: number;

  @ApiProperty({ description: 'Nome do prestador de serviço', required: false })
  @IsString()
  @IsOptional()
  prestadorServico?: string;

  @ApiProperty({
    description: 'Observações adicionais sobre a manutenção',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacoes?: string;
}
