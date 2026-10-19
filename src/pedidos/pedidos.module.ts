import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosService } from './services/pedidos.service';
import { PedidosController } from './controllers/pedidos.controller';
import { Pedidos } from './entities/pedido.entity';
import { User } from '../users/entities/user.entity';
import { Repartidores } from '../repartidores/entities/repartidore.entity';
import { Restaurante } from '../restaurantes/entities/restaurante.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedidos, User, Repartidores, Restaurante]),
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
