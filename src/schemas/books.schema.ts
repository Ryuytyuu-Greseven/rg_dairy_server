import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './users.schema';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true, type: mongoose.Schema.Types.String, ref: 'User' })
  author: User['username'];

  @Prop()
  genre: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  titleConfig: object;
}

export const BookSchema = SchemaFactory.createForClass(Book);
