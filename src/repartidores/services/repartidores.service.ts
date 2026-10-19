import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRepartidoreDto } from '../dto/create-repartidore.dto';
import { UpdateRepartidoreDto } from '../dto/update-repartidore.dto';
import { Repartidores } from '../entities/repartidore.entity';
import { User } from '../../users/entities/user.entity';
import { Restaurante } from '../../restaurantes/entities/restaurante.entity';

@Injectable()
export class RepartidoresService {
  constructor(
    @InjectRepository(Repartidores)
    private readonly repartidoresRepository: Repository<Repartidores>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Restaurante)
    private readonly restaurantesRepository: Repository<Restaurante>,
  ) {}

  async create(
    createRepartidoreDto: CreateRepartidoreDto,
  ): Promise<Repartidores> {
    const { userId, restauranteId, ...fields } = createRepartidoreDto;
    await this.ensureIdIsAvailable(fields.id);
    await this.ensureEmailIsAvailable(fields.email);
    await this.ensureUserIsAvailable(userId);

    const user = await this.findActiveUser(userId);
    const restaurante = await this.findRestaurante(restauranteId);
    const repartidor = this.repartidoresRepository.create({
      ...fields,
      userId,
      restauranteId,
      user,
      restaurante,
    });
    return this.repartidoresRepository.save(repartidor);
  }

  findAll(): Promise<Repartidores[]> {
    return this.repartidoresRepository.find({
      where: { isActive: true },
      relations: { user: true, restaurante: true, pedidos: true },
    });
  }

  async findOne(id: string): Promise<Repartidores> {
    const repartidor = await this.repartidoresRepository.findOne({
      where: { id, isActive: true },
      relations: { user: true, restaurante: true, pedidos: true },
    });
    if (!repartidor) {
      throw new NotFoundException(`El repartidor con id ${id} no existe`);
    }
    return repartidor;
  }

  async update(
    id: string,
    updateRepartidoreDto: UpdateRepartidoreDto,
  ): Promise<Repartidores> {
    const repartidor = await this.findOne(id);
    const { userId, restauranteId, ...fields } = updateRepartidoreDto;

    if (fields.email && fields.email !== repartidor.email) {
      await this.ensureEmailIsAvailable(fields.email);
    }

    Object.assign(repartidor, fields);

    if (userId !== undefined && userId !== repartidor.userId) {
      await this.ensureUserIsAvailable(userId);
      repartidor.user = await this.findActiveUser(userId);
      repartidor.userId = userId;
    }

    if (restauranteId !== undefined) {
      repartidor.restaurante = await this.findRestaurante(restauranteId);
      repartidor.restauranteId = restauranteId;
    }

    return this.repartidoresRepository.save(repartidor);
  }

  async remove(id: string): Promise<void> {
    const repartidor = await this.findOne(id);
    repartidor.isActive = false;
    await this.repartidoresRepository.save(repartidor);
  }

  private async findActiveUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id, isActive: true });
    if (!user) {
      throw new NotFoundException(`El usuario ${id} no existe o está inactivo`);
    }
    return user;
  }

  private async findRestaurante(id: number): Promise<Restaurante> {
    const restaurante = await this.restaurantesRepository.findOneBy({ id });
    if (!restaurante) {
      throw new NotFoundException(`El restaurante ${id} no existe`);
    }
    return restaurante;
  }

  private async ensureIdIsAvailable(id: string): Promise<void> {
    const existing = await this.repartidoresRepository.findOneBy({ id });
    if (existing) {
      throw new ConflictException('Ya existe un repartidor con este ID');
    }
  }

  private async ensureEmailIsAvailable(email: string): Promise<void> {
    const existing = await this.repartidoresRepository.findOneBy({ email });
    if (existing) {
      throw new ConflictException(
        'Ya existe un repartidor con este correo electrónico',
      );
    }
  }

  private async ensureUserIsAvailable(userId: string): Promise<void> {
    const existing = await this.repartidoresRepository.findOneBy({ userId });
    if (existing) {
      throw new ConflictException(
        'Este usuario ya está asignado a un repartidor',
      );
    }
  }
}
