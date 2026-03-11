import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret:
          config.get<string>('JWT_SECRET') ||
          'chat_app_super_secret_2026',
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
  ],

  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],

  exports: [
    PassportModule,
    JwtModule,
  ],
})
export class AuthModule {}