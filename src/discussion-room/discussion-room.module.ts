import { Module } from '@nestjs/common';
import { DiscussionRoomService } from './discussion-room.service';
import { DiscussionRoomController } from './discussion-room.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DiscussionRoomController],
  providers: [DiscussionRoomService],
})
export class DiscussionRoomModule {}
