import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../auth/enums/role.enum';
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  name: string;
  @Prop()
  phone: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true, default: Role.Client, enum: Role })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
