import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { firstValueFrom } from 'rxjs';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserCacheService {
  public cache: Map<string, UserDto> = new Map<string, UserDto>();

  constructor(
    @Inject('CLIENTS_SERVICE') private clientsService: ClientProxy,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    const job = new CronJob(CronExpression.EVERY_MINUTE, () => {
      this.cache.clear();
    });

    this.schedulerRegistry.addCronJob('cacheClearing', job);
    job.start();
  }

  async getOneById(id: string): Promise<UserDto> {
    const cachedUser: UserDto = this.cache.get(id);

    if (cachedUser) return cachedUser;

    try {
      const user: UserDto = await firstValueFrom(
        this.clientsService.send('getUserByIdFromDB', id),
      );

      this.cache.set(id, user);

      return user;
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
