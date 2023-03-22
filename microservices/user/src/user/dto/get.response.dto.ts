import { UserDocument } from '../db/user.schema';

export class GetResponseDto {
  constructor(public count: number, public data: UserDocument[]) {}
}
