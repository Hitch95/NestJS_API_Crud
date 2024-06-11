import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.usersService.find(email);
    if (!user.length) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user[0];
  }

  async signUp(email: string, password: string): Promise<User> {
    const user = await this.usersService.find(email);
    if (user.length) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create(email, hashedPassword);
  }
}
