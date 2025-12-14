import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CardsService } from '../cards/cards.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class BoardGateway {
  @WebSocketServer()
  server: Server;

  constructor(private cardsService: CardsService) {}

  @SubscribeMessage('card:move')
  async moveCard(@MessageBody() data) {
    const updated = await this.cardsService.moveCard(data);
    this.server.emit('card:moved', updated);
  }
}
