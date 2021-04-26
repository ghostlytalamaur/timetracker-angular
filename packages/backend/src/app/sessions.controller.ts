import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateSessionDto, ISession } from '@tt/types';
import { UserId } from './auth/user-decorator';
import { SessionsService } from './sessions.service';
import { EventsInterceptor } from './events.interceptor';

@UseInterceptors(EventsInterceptor)
@Controller({
  path: 'sessions',
})
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getSessions(
    @UserId() userId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<ISession[]> {
    return this.sessions.getSessions(userId, new Date(from), new Date(to));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addSession(
    @UserId() userId: string,
    @Body() body: CreateSessionDto,
  ): Promise<{ id: string }> {
    return this.sessions.addSession(userId, body).then((id) => ({ id }));
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateSession(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: Partial<CreateSessionDto>,
  ): Promise<number> {
    return this.sessions.updateSession(userId, id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteSession(@UserId() userId: string, @Param('id') id: string): Promise<number> {
    return this.sessions.deleteSession(userId, id);
  }
}
