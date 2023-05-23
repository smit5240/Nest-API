import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BoyDocument = HydratedDocument<Boy>;

@Schema()
export class Boy {
  @Prop()
  email: string;

  @Prop()
  mobile: string;

  @Prop()
  otp: number;
}

export const Boyschema = SchemaFactory.createForClass(Boy);
