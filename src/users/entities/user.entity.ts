import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Pedidos } from '../../pedidos/entities/pedido.entity';
import { Repartidores } from '../../repartidores/entities/repartidore.entity';
import { Restaurante } from '../../restaurantes/entities/restaurante.entity';

@Entity('users')
export class User {
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

  @OneToOne(() => Repartidores, (repartidor) => repartidor.user)
  repartidor?: Repartidores;

  @OneToMany(() => Pedidos, (pedido) => pedido.user)
  pedidos!: Pedidos[];

  @ManyToMany(() => Restaurante, (restaurante) => restaurante.users)
  @JoinTable({
    name: 'users_restaurantes',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'restauranteId',
      referencedColumnName: 'id',
    },
  })
  restaurantes!: Restaurante[];
}
