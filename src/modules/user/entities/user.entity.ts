import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { AlertEntity } from 'src/modules/alert/entities/alert.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @Column({ length: 100, nullable: false })
  public name!: string;

  @Column({ length: 255, nullable: false })
  public email!: string;

  @Column({ length: 255, nullable: false })
  public password!: string;

  @OneToMany(() => AlertEntity, (alert) => alert.user)
  public alerts!: AlertEntity[];
}
