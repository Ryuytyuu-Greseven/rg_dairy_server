import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TempUserDocument = HydratedDocument<TempUser>;

@Schema({ timestamps: true })
export class TempUser {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  personalNumber: string;

  @Prop({ required: true })
  profilename: string;

  @Prop()
  otp: string;
}

export const TempUserSchema = SchemaFactory.createForClass(TempUser);
