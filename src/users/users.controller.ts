import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import createUserDto from '../dto/create-user.dto';
import updateUserDto from 'src/dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { SerializeInterceptor } from 'src/interceptors/serializeInterceptor';

@Controller('auth')
@UseInterceptors(SerializeInterceptor)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  @Get()
  findUserByEmail(@Query('email') email: string) {
    const user = this.userService.find(email);
    return user;
  }

  @Get('/:id')
  @UseInterceptors(SerializeInterceptor)
  async findById(@Param('id') id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get('/whoAmi')
  async getUserSession(@Session() session: any) {
    const user = await this.userService.findOne(session.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get('/signout')
  async signOut(@Session() session: any) {
    session.userId = null;
    return { message: 'User signed out' };
  }

  @Post('/signup')
  async createUser(@Body() body: createUserDto, @Session() session: any) {
    const newUser = await this.authService.signUp(body.email, body.password);
    session.userId = newUser.id;
    return newUser;
  }

  @Post('/signin')
  async signIn(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: updateUserDto,
  ) {
    const userId = parseInt(id);
    await this.userService.update(userId, updateUserDto);
    return { message: 'User updated successfully' };
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
}
