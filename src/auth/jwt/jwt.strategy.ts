import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret_key',
    });
  }

async validate(payload: any) {

  if (process.env.NODE_ENV === 'development') {
    const user = await this.userRepo.findOneBy({ id: 1 });

    if (!user) {
      throw new UnauthorizedException('Dev user not found');
    }

    const { password, ...result } = user;
    return result;
  }

  const user = await this.userRepo.findOneBy({ id: payload.sub });

  if (!user) {
    throw new UnauthorizedException('Invalid token: user not found');
  }

  const { password, ...result } = user;
  return result;
}
}
