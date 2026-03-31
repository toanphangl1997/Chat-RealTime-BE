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

  // ================= REGISTER =================
  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('Email is already registered');
    }

    if (!dto.password || dto.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      ...dto,
      password: hashed,
    });

    const savedUser = await this.userRepo.save(user);

    const { password, ...userWithoutPassword } = savedUser;

    return {
      message: 'Register success. You can login now.',
      user: userWithoutPassword,
    };
  }

  // ================= LOGIN =================
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

    // Không tiết lộ email tồn tại hay không
    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const match = await bcrypt.compare(dto.password, user.password);

    if (!match) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    user.refreshToken = refreshToken;
    await this.userRepo.save(user);

    return {
      message: 'Login success',
      access_token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  // ================= LOGOUT =================
  async logout(userId: number) {
    await this.userRepo.update(userId, { refreshToken: null });

    return {
      message: 'Logout success',
    };
  }

  // ================= CHANGE PASSWORD =================
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

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException(
        'New password must be at least 6 characters',
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.userRepo.update(userId, {
      password: hashed,
    });

    return {
      message: 'Password changed successfully',
    };
  }
}
