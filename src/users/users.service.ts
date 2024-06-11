import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    console.log(user);
    return user;
  }

  find(email: string) {
    const users = this.repo.findBy({ email });
    return users;
  }

  async update(id: number, attr: Partial<User>) {
    const user = await this.findOne(id);
    if (user) {
      throw new Error('User not found');
    }

    Object.assign(user, attr);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    await this.repo.remove(user);
    return `User ${id} removed`;
  }
}
