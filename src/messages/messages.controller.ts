import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesService } from './messages.service';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.messagesService.create(dto);
  }

  // ĐẶT inbox TRƯỚC
  @Get('inbox')
  async getInbox(@Request() req) {
    return this.messagesService.getInboxUsers(req.user.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('conversation/:userId')
  getConversation(@Param('userId') userId: string, @Request() req) {
    const parsed = parseInt(userId, 10);
    if (isNaN(parsed)) throw new BadRequestException('Invalid userId');

    return this.messagesService.getConversation(req.user.id, parsed);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  // để cuối cùng
  @Get(':id')
  findOne(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) throw new BadRequestException('Invalid message ID');
    return this.messagesService.findOne(parsedId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMessageDto) {
    return this.messagesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}