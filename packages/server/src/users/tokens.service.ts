import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './schemas/tokens.schema';

@Injectable()
export class TokensService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

  async insert(userId: string, tokenId: string): Promise<void> {
    await this.tokenModel.create({ user: userId, tokenId });
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    const stored = await this.tokenModel.findOne({ user: userId }).exec();
    return tokenId === stored.tokenId;
  }

  async invalidate(userId: string): Promise<void> {
    await this.tokenModel.findOneAndRemove({ user: userId }).exec();
  }
}
