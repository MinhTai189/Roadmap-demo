import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { GoogleUserDto } from 'src/common/dtos/google-user.dto';
import { UserService } from '../user/user.service';

export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(req: Request) {
    const user = req.user as GoogleUserDto;

    let foundUser = await this.userService.findUserWithEmail(user.email);

    if (!foundUser) {
      foundUser = await this.userService.create({
        email: user.email,
        firstName: user.given_name,
        lastName: user.family_name,
      });
    }

    foundUser.accessToken = this.getAccessToken(user);

    return foundUser;
  }

  getAccessToken(user) {
    const payload = { email: user.email, id: user.id };

    return this.jwtService.sign(payload);
  }
}
