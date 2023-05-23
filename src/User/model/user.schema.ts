import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const Usershema = SchemaFactory.createForClass(Users);
