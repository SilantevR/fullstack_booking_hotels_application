import { Types } from 'mongoose';
import { User } from 'src/users/interfaces/interfaces';

export interface SupportRequest {
  id?: Types.ObjectId;
  user: User;
  createdAt: Date;
  messages?: Message[];
  isActive?: boolean;
  hasNewMessages?: boolean;
}

export interface Message {
  _id?: Types.ObjectId;
  author: User;
  sentAt: Date;
  text: string;
  readAt?: Date;
}

export interface CreateSupportRequestDto {
  user: Types.ObjectId;
  text: string;
}

export interface SendMessageDto {
  author: Types.ObjectId;
  supportRequest: Types.ObjectId;
  text: string;
}

export interface MarkMessagesAsReadDto {
  user: Types.ObjectId;
  supportRequest: Types.ObjectId;
  createdBefore: Date;
}

export interface GetChatListParams {
  user: Types.ObjectId | null;
  activeUser: Types.ObjectId;
  isActive: boolean;
  limit: number;
  offset: number;
}

export interface ISupportRequestService {
  findSupportRequests(
    params: GetChatListParams,
  ): Promise<{ count: number; result: SupportRequest[] }>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: Types.ObjectId): Promise<Message[]>;
  /*Реализовано за счет функционала комнат библиотеки soket.io в chat.gateway.ts
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void;*/
}

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(
    supportRequest: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Message[]>;
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(
    supportRequest: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Message[]>;
  closeRequest(supportRequest: Types.ObjectId): Promise<void>;
}
