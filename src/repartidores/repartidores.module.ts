import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepartidoresService } from './services/repartidores.service';
import { RepartidoresController } from './controllers/repartidores.controller';
import { Repartidores } from './entities/repartidore.entity';
import { User } from '../users/entities/user.entity';
import { Restaurante } from '../restaurantes/entities/restaurante.entity';
import { Pedidos } from '../pedidos/entities/pedido.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Repartidores, User, Restaurante, Pedidos]),
  ],
  controllers: [RepartidoresController],
  providers: [RepartidoresService],
})
export class RepartidoresModule {}
