import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { UserCacheModule } from './user/user-cache.module';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule.forRoot(), UserCacheModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
