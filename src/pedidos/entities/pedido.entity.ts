import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Repartidores } from '../../repartidores/entities/repartidore.entity';
import { Restaurante } from '../../restaurantes/entities/restaurante.entity';

@Entity('pedidos')
export class Pedidos {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'integer' })
  num_pedido!: number;

  @Column({ type: 'text', nullable: true })
  estado_pedido!: string | null;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo!: number;

  @Column({ type: 'varchar', length: 20 })
  userId!: string;

  @ManyToOne(() => User, (user) => user.pedidos, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'varchar', length: 20 })
  repartidorId!: string;

  @ManyToOne(() => Repartidores, (repartidor) => repartidor.pedidos, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'repartidorId' })
  repartidor!: Repartidores;

  @Column({ type: 'integer' })
  restauranteId!: number;

  @ManyToOne(() => Restaurante, (restaurante) => restaurante.pedidos, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'restauranteId' })
  restaurante!: Restaurante;
}
