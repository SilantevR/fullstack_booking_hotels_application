import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  name: string;
  @Prop()
  contactPhone: string;
  @Prop({ required: true })
  passwordHash: string;
  @Prop({ required: true, default: 'client' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
