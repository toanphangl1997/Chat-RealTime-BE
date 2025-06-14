import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const { sender_id, receiver_id, content } = createMessageDto;

    const sender = await this.userRepository.findOneBy({ id: sender_id });
    const receiver = await this.userRepository.findOneBy({ id: receiver_id });

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }

    const message = this.messagesRepository.create({
      content,
      sender,
      receiver,
    });

    return this.messagesRepository.save(message);
  }

  findAll() {
    return this.messagesRepository.find({
      relations: ['sender', 'receiver'],
      order: { created_at: 'ASC' },
    });
  }

  async findOne(id: number) {
    const message = await this.messagesRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async update(id: number, data: UpdateMessageDto) {
    const message = await this.messagesRepository.findOne({ where: { id } });
    if (!message) throw new NotFoundException('Message not found');

    if (data.content) message.content = data.content;

    return this.messagesRepository.save(message);
  }

  async remove(id: number) {
    const message = await this.findOne(id);
    await this.messagesRepository.delete(id);
    return {
      message: 'Deleted successfully',
      data: message,
    };
  }

  async getInboxUsers(currentUserId: number) {
    const messages = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('message.sender_id = :id OR message.receiver_id = :id', {
        id: currentUserId,
      })
      .orderBy('message.created_at', 'ASC')
      .getMany();

    const userMap = new Map<number, any>();

    for (const msg of messages) {
      const otherUser =
        msg.sender.id === currentUserId ? msg.receiver : msg.sender;

      if (!userMap.has(otherUser.id)) {
        userMap.set(otherUser.id, {
          id: otherUser.id,
          name: otherUser.name,
          avatar: otherUser.avatar,
          online: otherUser.online,
          lastMessage: msg.content,
        });
      }
    }

    return Array.from(userMap.values());
  }
}
