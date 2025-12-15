import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  emitColumnCreated(column: any) {
    if (this.server) {
      this.server.emit('column:created', column);
    }
  }

  emitColumnUpdated(column: any) {
    if (this.server) {
      this.server.emit('column:updated', column);
    }
  }

  emitColumnDeleted(columnId: string) {
    if (this.server) {
      this.server.emit('column:deleted', columnId);
    }
  }

  emitCardCreated(card: any) {
    if (this.server) {
      this.server.emit('card:created', card);
    }
  }

  emitCardMoved(card: any) {
    if (this.server) {
      this.server.emit('card:moved', card);
    }
  }

  emitCardUpdated(card: any) {
    if (this.server) {
      this.server.emit('card:updated', card);
    }
  }

  emitCardDeleted(payload: { cardId: string; columnId: string }) {
    if (this.server) {
      this.server.emit('card:deleted', payload);
    }
  }

  emitColumnsReordered(columnIds: string[]) {
    if (this.server) {
      this.server.emit('columns:reordered', columnIds);
    }
  }
}
