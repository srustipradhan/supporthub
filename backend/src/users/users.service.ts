import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: Role;
  }): Promise<User> {
    const user = this.usersRepository.create({
      ...data,
      role: data.role ?? Role.USER,
    });
    return this.usersRepository.save(user);
  }

  async count(): Promise<number> {
    return this.usersRepository.count();
  }

  async updateFcmToken(userId: string, token: string | null): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.fcmToken = token;
    return this.usersRepository.save(user);
  }
}
