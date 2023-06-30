import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from 'src/generated/dtos';
import { AuthService } from './auth.service';
import { GGLoginDto } from './dto/google-login.dto';
import { JWTGuard } from './strategies/jwt.strategy';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login with Google' })
  @ApiCreatedResponse({
    description: 'Login successfully',
    type: UserDto,
  })
  @ApiBody({
    type: GGLoginDto,
  })
  @Post('login-google')
  googleAuthRedirect(
    @Body('credential') credential: string,
    @Req() req: Request,
  ) {
    return this.authService.login(credential, req);
  }

  @ApiOperation({ summary: 'Get new access token with refresh token' })
  @ApiCreatedResponse({
    description: 'New access token has been returned successfully',
    type: 'string',
  })
  @ApiParam({
    name: 'credentials',
  })
  @Get('refresh-token')
  getRefreshToken(@Req() req: Request) {
    return this.authService.refreshToken(req.cookies['Refresh_Token']);
  }
}
