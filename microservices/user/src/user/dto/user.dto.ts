import { UserDocument } from '../db/user.schema';

export class UserDto {
  constructor(data: UserDocument) {
    this._id = data._id;
    this.name = data.name;
    this.email = data.email;
    this.country = data.country;
    this.city = data.city;
  }

  public _id: string;
  public name: string;
  public email: string;
  public country: string;
  public city: string;
}
