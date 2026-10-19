import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePedidoDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  num_pedido!: number;

  @IsOptional()
  @IsString()
  estado_pedido?: string | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costo!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsString()
  @Matches(/^\d{5,20}$/)
  userId!: string;

  @IsString()
  @Matches(/^\d{5,20}$/)
  repartidorId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  restauranteId!: number;
}
