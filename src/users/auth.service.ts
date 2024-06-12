import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  //----------------------------------------------------------------
  async signup(email: string, password: string) {
    //See if email is in use
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }
    //Hash the password
    // 1. Generate a salt
    const salt = randomBytes(8).toString('hex');
    //2. Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //3. Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    //Create a new user and save it
    const user = this.usersService.create(email, result);
    //return the user
    return user;
  }

  //----------------------------------------------------------------
  async signin(email: string, password: string) {
    //1. Get the user by email. If not found launch a NotFoundException
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    //2. Get the salt of the persisted password in the DB
    const [salt, storedHash] = user.password.split('.');

    //2. Compare the provided hashed password with the stored hash
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad user/password combination');
    }

    return user;
  }
}
