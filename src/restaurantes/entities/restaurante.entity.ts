import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pedidos } from '../../pedidos/entities/pedido.entity';
import { Repartidores } from '../../repartidores/entities/repartidore.entity';
import { User } from '../../users/entities/user.entity';

@Entity('restaurante')
export class Restaurante {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  menu!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  TiempoRealizacionAprox!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  Calificacion!: number;

  @Column({ type: 'int' })
  CapacidadMaxPedidos!: number;

  @Column({ default: true })
  isAbierto!: boolean;

  @OneToMany(() => Repartidores, (repartidor) => repartidor.restaurante)
  repartidores!: Repartidores[];

  @OneToMany(() => Pedidos, (pedido) => pedido.restaurante)
  pedidos!: Pedidos[];

  @ManyToMany(() => User, (user) => user.restaurantes)
  users!: User[];
}
