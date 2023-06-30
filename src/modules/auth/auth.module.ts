import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { OAuth2Client } from 'google-auth-library';
import { GG_OAUTH_2_CLIENT } from 'src/constant/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTStrategy } from './strategies/jwt.strategy';
import { BoxModule } from '../box/box.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: GG_OAUTH_2_CLIENT,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return new OAuth2Client(
          configService.get('GG_CLIENT_ID'),
          configService.get('GG_CLIENT_SECRET'),
        );
      },
    },
    JWTStrategy,
  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION_SECONDS') + 's',
          },
        };
      },
    }),
    UserModule,
    ConfigModule,
    BoxModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
