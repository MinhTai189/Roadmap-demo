import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { UserDto } from 'src/generated/dtos';
import { JWTGuard } from '../auth/strategies/jwt.strategy';
import { User } from 'src/common/decorators/user.decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get the profile' })
  @ApiCreatedResponse({
    description: 'The profile has been returned successfully',
    type: UserDto,
  })
  @UseGuards(JWTGuard)
  getProfile(@User('id') userId: number) {
    return this.userService.findOne(userId);
  }
}
