import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRestauranteDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  menu?: string | null;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  TiempoRealizacionAprox!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  Calificacion!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  CapacidadMaxPedidos!: number;

  @IsOptional()
  @IsBoolean()
  isAbierto?: boolean;
}
