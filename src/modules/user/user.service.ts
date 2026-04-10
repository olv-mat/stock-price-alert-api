import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  public findOne(id: string): Promise<UserEntity> {
    return this.getById(id);
  }

  private async getById(id: string): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOneBy({ id: id });
    if (!userEntity) throw new NotFoundException('User not found');
    return userEntity;
  }
}
