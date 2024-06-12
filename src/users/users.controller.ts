import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  Delete,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serializeInterceptor';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './decorator/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    session.userId = null;
  }

  // @Get('/whoAmI')
  // async whoAmI(@Session() session: any) {
  //     return await this.usersService.findOne(session.userId)
  // }

  @Get('/whoAmI')
  @UseGuards(AuthGuard)
  async whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color;
  }

  @Get('/:id')
  findById(@Param('id') id: number) {
    console.log('HANDLER findById !');
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  findUserByEmail(@Query('email') email: string) {
    const user = this.usersService.find(email);
    return user;
  }

  @Get()
  findAll(@Query('all') all: boolean) {
    const user = this.usersService.findAll();
    return user;
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
