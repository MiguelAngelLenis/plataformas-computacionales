import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Pedidos } from '../../pedidos/entities/pedido.entity';
import { Restaurante } from '../../restaurantes/entities/restaurante.entity';
import { User } from '../../users/entities/user.entity';

@Entity('repartidores')
export class Repartidores {
  @PrimaryColumn({ length: 20 })
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true, length: 254 })
  email!: string;

  @Column({ type: 'integer' })
  age!: number;

  @Column({ length: 30 })
  phone!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  Calificacion!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  TiempoEntregaAprox!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  GanancciaAcumulada!: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  userId!: string;

  @OneToOne(() => User, (user) => user.repartidor, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'integer' })
  restauranteId!: number;

  @ManyToOne(() => Restaurante, (restaurante) => restaurante.repartidores, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'restauranteId' })
  restaurante!: Restaurante;

  @OneToMany(() => Pedidos, (pedido) => pedido.repartidor)
  pedidos!: Pedidos[];
}
