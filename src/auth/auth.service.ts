// auth.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashed });
    const savedUser = await this.userRepo.save(user);

    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: [
        'id',
        'email',
        'password',
        'name',
        'avatar',
        'role',
        'refreshToken',
      ],
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    // Optional: tạo refreshToken (nếu cần)
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );
    user.refreshToken = refreshToken;
    await this.userRepo.save(user);

    return { access_token: token, refreshToken };
  }

  async logout(userId: number) {
    // xóa refresh token
    await this.userRepo.update(userId, { refreshToken: null });
  }

  async changePassword(
    userId: number,
    body: { currentPassword: string; newPassword: string },
  ) {
    const { currentPassword, newPassword } = body;

    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    // validate new password
    if (newPassword.length < 6) {
      throw new UnauthorizedException('Password must be at least 6 characters');
    }

    // hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    await this.userRepo.update(userId, {
      password: hashed,
    });

    return { message: 'Password changed successfully' };
  }
}
