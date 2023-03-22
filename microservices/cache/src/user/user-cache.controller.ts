import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserDto } from './dto/user.dto';
import { UserCacheService } from './user-cache.service';

@Controller('user-cache')
export class UserCacheController {
  constructor(private readonly userCacheService: UserCacheService) {}

  @MessagePattern('userById')
  async getOneById(@Payload() id: string): Promise<UserDto> {
    return this.userCacheService.getOneById(id);
  }
}
