import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestauranteDto } from '../dto/create-restaurante.dto';
import { UpdateRestauranteDto } from '../dto/update-restaurante.dto';
import { Restaurante } from '../entities/restaurante.entity';

@Injectable()
export class RestaurantesService {
  constructor(
    @InjectRepository(Restaurante)
    private readonly restaurantesRepository: Repository<Restaurante>,
  ) {}

  create(createRestauranteDto: CreateRestauranteDto): Promise<Restaurante> {
    const restaurante =
      this.restaurantesRepository.create(createRestauranteDto);
    return this.restaurantesRepository.save(restaurante);
  }

  findAll(): Promise<Restaurante[]> {
    return this.restaurantesRepository.find({
      relations: { users: true, repartidores: true, pedidos: true },
    });
  }

  async findOne(id: number): Promise<Restaurante> {
    const restaurante = await this.restaurantesRepository.findOne({
      where: { id },
      relations: { users: true, repartidores: true, pedidos: true },
    });
    if (!restaurante) {
      throw new NotFoundException(`El restaurante con id ${id} no existe`);
    }
    return restaurante;
  }

  async update(
    id: number,
    updateRestauranteDto: UpdateRestauranteDto,
  ): Promise<Restaurante> {
    const restaurante = await this.restaurantesRepository.preload({
      id,
      ...updateRestauranteDto,
    });
    if (!restaurante) {
      throw new NotFoundException(`El restaurante con id ${id} no existe`);
    }
    return this.restaurantesRepository.save(restaurante);
  }

  async remove(id: number): Promise<void> {
    const restaurante = await this.findOne(id);
    await this.restaurantesRepository.remove(restaurante);
  }
}
