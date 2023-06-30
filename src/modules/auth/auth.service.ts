import {
  Inject,
  forwardRef,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { GG_OAUTH_2_CLIENT } from 'src/constant/common';
import { UserService } from '../user/user.service';
import { BoxService } from '../box/box.service';

export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private jwtService: JwtService,
    @Inject(GG_OAUTH_2_CLIENT)
    private readonly ggService: OAuth2Client,
    private readonly configService: ConfigService,
    private readonly boxService: BoxService,
  ) {}

  async login(token: string, res: Request) {
    const ticket = await this.ggService.verifyIdToken({
      idToken: token,
      audience: this.configService.get('GG_CLIENT_ID'),
    });

    const { email, family_name, given_name }: any = ticket.getPayload();

    let foundUser = await this.userService.findUserWithEmail(email);

    if (!foundUser) {
      foundUser = await this.userService.create({
        email,
        firstName: given_name,
        lastName: family_name,
      });

      await this.boxService.createBoxes(foundUser.id);
    }

    foundUser.accessToken = this.getAccessToken(foundUser);
    res.res.cookie('Refresh_Token', this.getRefreshToken(foundUser), {
      httpOnly: true,
      maxAge: this.configService.get('JWT_EXPIRATION_SECONDS') * 3 * 1000,
    });

    return foundUser;
  }

  async validateUser(email: string) {
    return await this.userService.findUserWithEmail(email);
  }

  async refreshToken(token: string) {
    try {
      this.jwtService.verify(token);
    } catch (err) {
      return new UnauthorizedException({
        message: 'Access is denied due to invalid credentials',
      });
    }

    const user = this.jwtService.decode(token);

    return this.getAccessToken(user);
  }

  getAccessToken(user) {
    const payload = { email: user.email, id: user.id };

    return this.jwtService.sign(payload);
  }

  getRefreshToken(user) {
    const payload = { email: user.email, id: user.id };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRATION_SECONDS') * 3 + 's',
    });
  }
}
