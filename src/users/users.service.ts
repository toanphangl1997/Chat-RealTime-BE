import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MessagesService } from 'src/messages/messages.service';
import { Repository } from 'typeorm';

// import cloudinary để xoá ảnh cũ
import { v2 as cloudinary } from 'cloudinary';

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
      return null;
    }
    return user;
  }

  // UPDATE (có xử lý avatar cloudinary)
  async update(id: number, updateData: Partial<User>) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    // nếu có avatar mới → xoá avatar cũ trên cloud
    if (updateData.avatar && user.avatar) {
      try {
        const publicId = this.extractPublicId(user.avatar);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.warn('Delete old avatar failed:', error);
      }
    }

    // update user
    Object.assign(user, updateData);
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    // xoá avatar khi xoá user
    if (user.avatar) {
      try {
        const publicId = this.extractPublicId(user.avatar);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.warn('Delete avatar failed:', error);
      }
    }

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

  // helper: lấy public_id từ URL cloudinary
  private extractPublicId(url: string): string | null {
    try {
      const parts = url.split('/');
      const fileName = parts[parts.length - 1];
      const publicId = fileName.split('.')[0];

      // nếu bạn dùng folder 'chat-app'
      return `chat-app/${publicId}`;
    } catch {
      return null;
    }
  }
}