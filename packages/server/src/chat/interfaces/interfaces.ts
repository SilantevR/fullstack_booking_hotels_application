import { Types } from 'mongoose';

export interface SupportRequest {
  id?: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
  messages?: Message[];
  isActive?: boolean;
  hasNewMessages?: boolean;
}

export interface Message {
  _id?: Types.ObjectId;
  author: Types.ObjectId;
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
  isActive: boolean;
  limit: number;
  offset: number;
}

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
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
