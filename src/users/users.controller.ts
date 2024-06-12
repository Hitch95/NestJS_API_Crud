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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import createUserDto from '../dto/create-user.dto';
import updateUserDto from 'src/dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { SerializeInterceptor } from 'src/interceptors/serializeInterceptor';
import { CurrentUserInterceptor } from './interceptor/current-user-interceptor';
import { AuthGuard } from './guards/auth.guards';
import { User } from './user.entity';
import { CurrentUser } from './decorator/current-user.decorator';

@Controller('auth')
@UseInterceptors(SerializeInterceptor)
@UseInterceptors(CurrentUserInterceptor)
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
  @UseGuards(AuthGuard)
  async whoAmi(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  async signOut(@Session() session: any) {
    session.userId = null;
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
