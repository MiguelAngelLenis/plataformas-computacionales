import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRepartidoreDto {
  @IsString()
  @Matches(/^\d{5,20}$/)
  id!: string;

  @IsString()
  @Length(2, 100)
  name!: string;

  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  @IsEmail()
  @Length(5, 254)
  email!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(130)
  age!: number;

  @IsString()
  @MaxLength(30)
  @Matches(/^\+?[0-9]{7,15}$/)
  phone!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  Calificacion!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  TiempoEntregaAprox!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  GanancciaAcumulada!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsString()
  @Matches(/^\d{5,20}$/)
  userId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  restauranteId!: number;
}
