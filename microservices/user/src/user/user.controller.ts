import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { validateOrReject } from 'class-validator';
import { GetDto } from './dto/get.request.dto';
import { GetResponseDto } from './dto/get.response.dto';
import { TotalResponseDto } from './dto/total.response.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('users')
  async getUsers(@Payload() data: GetDto): Promise<GetResponseDto> {
    try {
      const getDto: GetDto = new GetDto(data);

      await validateOrReject(getDto);
    } catch (err) {
      throw new RpcException(err);
    }

    return this.userService.findAll(new GetDto(data));
  }

  @MessagePattern('totals')
  async getTotals(): Promise<TotalResponseDto[]> {
    return this.userService.getTotals();
  }

  @MessagePattern('getUserByIdFromDB')
  async getUserById(@Payload() id: string): Promise<UserDto> {
    return new UserDto(await this.userService.getUserById(id));
  }
}
