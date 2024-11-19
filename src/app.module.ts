import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { MarketModule } from './market/market.module';
import { DiscussionRoomModule } from './discussion-room/discussion-room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    MarketModule,
    DiscussionRoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
