import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './db/user.schema';
import { GetDto } from './dto/get.request.dto';
import { GetResponseDto } from './dto/get.response.dto';
import { TotalResponseDto } from './dto/total.response.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(dto: GetDto): Promise<GetResponseDto> {
    const { country, city, pageNumber, amountPerPage } = dto;

    const users: UserDocument[] = await this.userModel
      .find(
        { country, city },
        { _id: 1, name: 1, email: 1, country: 1, city: 1 },
      )
      .limit(amountPerPage)
      .skip(amountPerPage * (pageNumber - 1))
      .lean();

    return new GetResponseDto(users.length, users);
  }

  async getTotals(): Promise<TotalResponseDto[]> {
    return this.userModel.aggregate([
      {
        $group: {
          _id: { country: '$country', city: '$city' },
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          country: '$_id.country',
          city: '$_id.city',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);
  }

  async getUserById(id: string): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new RpcException('Id is not a valid');
    }

    const user: UserDocument = await this.userModel.findById(id).lean();

    if (!user) throw new RpcException('User not found');

    return user;
  }
}
