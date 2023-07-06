import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
  @Prop({ required: true })
  user: string;
  @Prop({ required: true })
  tokenId: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
