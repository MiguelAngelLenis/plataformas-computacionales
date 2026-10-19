import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateRepartidoreDto } from './create-repartidore.dto';

export class UpdateRepartidoreDto extends PartialType(
  OmitType(CreateRepartidoreDto, ['id'] as const),
) {}
