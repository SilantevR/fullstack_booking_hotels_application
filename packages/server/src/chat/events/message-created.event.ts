import { Message } from '../interfaces/interfaces';

export class MessageCreatedEvent {
  supportRequest: string;
  message: Message;
}
