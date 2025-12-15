import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from '../shared/socket.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class BoardGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private socketService: SocketService) {}

  afterInit(server: Server) {
    this.socketService.setServer(server);
    console.log('🚀 WebSocket inicializado');
  }

  handleConnection(client: Socket) {
    console.log(`✅ WebSocket conectado: ${client.id}`);
    console.log(`   Total conectados: ${this.server.engine.clientsCount}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ WebSocket desconectado: ${client.id}`);
    console.log(`   Total conectados: ${this.server.engine.clientsCount}`);
  }

  // ========== EVENTOS DE RE-TRANSMISIÓN ==========
  
  @SubscribeMessage('column:created')
  handleColumnCreated(@MessageBody() data: any) {
    console.log(`📤 Re-transmitiendo column:created - "${data.title}"`);
    this.server.emit('column:created', data);
  }

  @SubscribeMessage('column:updated')
  handleColumnUpdated(@MessageBody() data: any) {
    console.log(`📤 Re-transmitiendo column:updated - ${data.id}`);
    this.server.emit('column:updated', data);
  }

  @SubscribeMessage('column:deleted')
  handleColumnDeleted(@MessageBody() columnId: string) {
    console.log(`📤 Re-transmitiendo column:deleted - ${columnId}`);
    this.server.emit('column:deleted', columnId);
  }

  @SubscribeMessage('card:created')
  handleCardCreated(@MessageBody() data: any) {
    console.log(`📤 Re-transmitiendo card:created - "${data.title}"`);
    this.server.emit('card:created', data);
  }

  @SubscribeMessage('card:moved')
  handleCardMoved(@MessageBody() data: any) {
    console.log(`📤 Re-transmitiendo card:moved - ${data.id} a col ${data.columnId}`);
    this.server.emit('card:moved', data);
  }

  @SubscribeMessage('card:deleted')
  handleCardDeleted(@MessageBody() payload: any) {
    console.log(`📤 Re-transmitiendo card:deleted - ${payload.cardId}`);
    this.server.emit('card:deleted', payload);
  }

  @SubscribeMessage('columns:reordered')
  handleColumnsReordered(@MessageBody() columnIds: string[]) {
    console.log(`📤 Re-transmitiendo columns:reordered`);
    this.server.emit('columns:reordered', columnIds);
  }
}
