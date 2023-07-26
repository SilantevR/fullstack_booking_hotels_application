import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageCreatedEvent } from '../events/message-created.event';

@Injectable()
export class MessageCreatedListener {
  @OnEvent('message.send')
  handleMessageCreatedEvent(event: MessageCreatedEvent) {
    // handle and process "OrderCreatedEvent" event
    console.log(event);
  }
}
