import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './schemas/tokens.schema';

@Injectable()
export class TokensService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

  async insert(userId: Types.ObjectId, tokenId: string): Promise<void> {
    await this.tokenModel.create({ user: userId, tokenId });
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    const stored = await this.tokenModel.find({ user: userId }).exec();
    return stored.some((token) => {
      return token.tokenId === tokenId;
    });
  }

  async invalidate(userId: string): Promise<void> {
    await this.tokenModel.deleteMany({ user: userId }).exec();
  }
}
