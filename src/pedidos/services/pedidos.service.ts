import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePedidoDto } from '../dto/create-pedido.dto';
import { UpdatePedidoDto } from '../dto/update-pedido.dto';
import { Pedidos } from '../entities/pedido.entity';
import { User } from '../../users/entities/user.entity';
import { Repartidores } from '../../repartidores/entities/repartidore.entity';
import { Restaurante } from '../../restaurantes/entities/restaurante.entity';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedidos)
    private readonly pedidosRepository: Repository<Pedidos>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Repartidores)
    private readonly repartidoresRepository: Repository<Repartidores>,
    @InjectRepository(Restaurante)
    private readonly restaurantesRepository: Repository<Restaurante>,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedidos> {
    const user = await this.usersRepository.findOneBy({
      id: createPedidoDto.userId,
      isActive: true,
    });
    if (!user) {
      throw new NotFoundException(
        `El usuario ${createPedidoDto.userId} no existe o está inactivo`,
      );
    }

    const repartidor = await this.repartidoresRepository.findOneBy({
      id: createPedidoDto.repartidorId,
      isActive: true,
    });
    if (!repartidor) {
      throw new NotFoundException(
        `El repartidor ${createPedidoDto.repartidorId} no existe o está inactivo`,
      );
    }

    const restaurante = await this.restaurantesRepository.findOneBy({
      id: createPedidoDto.restauranteId,
    });
    if (!restaurante) {
      throw new NotFoundException(
        `El restaurante ${createPedidoDto.restauranteId} no existe`,
      );
    }
    if (repartidor.restauranteId !== restaurante.id) {
      throw new BadRequestException(
        'El repartidor no pertenece al restaurante del pedido',
      );
    }

    const pedido = this.pedidosRepository.create({
      ...createPedidoDto,
      user,
      repartidor,
      restaurante,
    });
    return this.pedidosRepository.save(pedido);
  }

  findAll(): Promise<Pedidos[]> {
    return this.pedidosRepository.find({
      relations: { user: true, repartidor: true, restaurante: true },
    });
  }

  async findOne(id: number): Promise<Pedidos> {
    const pedido = await this.pedidosRepository.findOne({
      where: { id },
      relations: { user: true, repartidor: true, restaurante: true },
    });
    if (!pedido) {
      throw new NotFoundException(`El pedido con id ${id} no existe`);
    }
    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedidos> {
    const pedido = await this.findOne(id);
    const { userId, repartidorId, restauranteId, ...fields } = updatePedidoDto;
    Object.assign(pedido, fields);

    if (userId !== undefined) {
      const user = await this.usersRepository.findOneBy({
        id: userId,
        isActive: true,
      });
      if (!user) {
        throw new NotFoundException(
          `El usuario ${userId} no existe o está inactivo`,
        );
      }
      pedido.user = user;
      pedido.userId = user.id;
    }

    if (repartidorId !== undefined) {
      const repartidor = await this.repartidoresRepository.findOneBy({
        id: repartidorId,
        isActive: true,
      });
      if (!repartidor) {
        throw new NotFoundException(
          `El repartidor ${repartidorId} no existe o está inactivo`,
        );
      }
      pedido.repartidor = repartidor;
      pedido.repartidorId = repartidor.id;
    }

    if (restauranteId !== undefined) {
      const restaurante = await this.restaurantesRepository.findOneBy({
        id: restauranteId,
      });
      if (!restaurante) {
        throw new NotFoundException(
          `El restaurante ${restauranteId} no existe`,
        );
      }
      if (pedido.repartidor.restauranteId !== restaurante.id) {
        throw new BadRequestException(
          'El repartidor no pertenece al restaurante del pedido',
        );
      }
      pedido.restaurante = restaurante;
      pedido.restauranteId = restaurante.id;
    }

    return this.pedidosRepository.save(pedido);
  }

  async remove(id: number): Promise<void> {
    const pedido = await this.findOne(id);
    await this.pedidosRepository.remove(pedido);
  }
}
