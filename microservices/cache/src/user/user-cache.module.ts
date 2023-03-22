import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { UserCacheController } from './user-cache.controller';
import { UserCacheService } from './user-cache.service';

@Module({
  imports: [ConfigModule],
  controllers: [UserCacheController],
  providers: [
    {
      provide: 'CLIENTS_SERVICE',
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_DEFAULT_USER');
        const password = configService.get('RABBITMQ_DEFAULT_PASS');
        const host = configService.get('RABBITMQ_HOST');
        const queueName = configService.get('RABBITMQ_USER_QUEUE_NAME');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
    UserCacheService,
  ],
})
export class UserCacheModule {}
