import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }
    const user = await this.repo.findOneBy({ id });
    return user;
  }

  find(email: string) {
    const users = this.repo.findBy({ email });
    return users;
  }

  findAll() {
    const users = this.repo.find();
    return users;
  }

  async update(id: number, attr: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    //Override properties of found user by new props
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
