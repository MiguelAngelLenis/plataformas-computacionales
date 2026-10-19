import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantesService } from './sevices/restaurantes.service';
import { RestaurantesController } from './controllers/restaurantes.controller';
import { Restaurante } from './entities/restaurante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurante])],
  controllers: [RestaurantesController],
  providers: [RestaurantesService],
})
export class RestaurantesModule {}
