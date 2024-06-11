import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import createUserDto from '../dto/create-user.dto';
import updateUserDto from 'src/dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  // Implementation for getting all users
  findUserByEmail(@Query('email') email: string) {
    const user = this.userService.find(email);
    return user;
  }

  @Get('/:id')
  findById(@Param('id') id: number) {
    const user = this.userService.findOne(id);
    console.log('findById ' + user);
    return user;
  }

  @Post('/signup')
  createUser(@Body() body: createUserDto) {
    return this.userService.create(body.email, body.password);
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
