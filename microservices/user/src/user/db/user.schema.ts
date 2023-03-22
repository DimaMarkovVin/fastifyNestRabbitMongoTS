import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true, minlength: 1, maxlength: 255 })
  name: string;

  @Prop({ required: true, unique: true, minlength: 1, maxlength: 255 })
  email: string;

  @Prop({ required: true, minlength: 1, maxlength: 255 })
  password: string;

  @Prop({ required: true, minlength: 1, maxlength: 255 })
  country: string;

  @Prop({ required: true, minlength: 1, maxlength: 255 })
  city: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ country: 1, city: 1 });

export { UserSchema };
