import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateSessionDto, ImportDataDto } from '@timetracker/shared';
import { UserId } from './auth/user-decorator';
import { SessionsService } from './sessions.service';
import { TagsService } from './tags.service';

@Controller({
  path: '/import',
})
export class ImportController {
  constructor(private readonly tags: TagsService, private readonly sessions: SessionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async importData(@UserId() userId: string, @Body() body: ImportDataDto): Promise<void> {
    const tagsMap = await this.tags.addSessionTags(userId, body.tags);
    const sessions: CreateSessionDto[] = body.sessions.map((session) => {
      return {
        start: session.start,
        duration: session.duration,
        tags: session.tags.map((id) => tagsMap[id]),
      };
    });

    await this.sessions.addSessions(userId, sessions);
  }
}
