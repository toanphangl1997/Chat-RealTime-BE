import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MessagesService } from 'src/messages/messages.service';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly messagesService: MessagesService,
  ) {}

  create(userData: Partial<User>) {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      console.warn(`User with ID ${id} not found`);
      return null; // Hoặc throw nếu cần
    }
    return user;
  }

  async update(id: number, updateData: Partial<User>) {
    const result = await this.usersRepository.update(id, updateData);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.delete(id);
    return {
      message: 'User deleted successfully',
      user,
    };
  }

  async markUserOnline(userId: number) {
    await this.usersRepository.update(userId, { online: true });
  }

  async markUserOffline(userId: number) {
    await this.usersRepository.update(userId, { online: false });
  }
}
