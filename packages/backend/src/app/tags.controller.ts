import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateSessionTagDto, ISessionTag } from '@tt/shared';
import { UserId } from './auth/user-decorator';
import { TagsService } from './tags.service';
import { EventsInterceptor } from './events.interceptor';

@UseInterceptors(EventsInterceptor)
@Controller({
  path: '/tags',
})
export class TagsController {
  constructor(private readonly tags: TagsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getSessionTags(@UserId() userId: string): Promise<ISessionTag[]> {
    return this.tags.getSessionTags(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addSessionTag(
    @UserId() userId: string,
    @Body() body: CreateSessionTagDto,
  ): Promise<{ id: string }> {
    return this.tags.addSessionTag(userId, body).then((id) => ({ id }));
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateSessionTag(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: Partial<CreateSessionTagDto>,
  ): Promise<number> {
    return this.tags.updateSessionTag(userId, id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteSessionTag(@UserId() userId: string, @Param('id') id: string): Promise<void> {
    return this.tags.deleteSessionTag(userId, id);
  }
}
