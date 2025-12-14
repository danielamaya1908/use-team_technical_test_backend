import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  // 🔹 REST – crear tarjeta
  async create(dto: { title: string; columnId: string }) {
    const count = await this.prisma.card.count({
      where: { columnId: dto.columnId },
    });

    return this.prisma.card.create({
      data: {
        title: dto.title,
        columnId: dto.columnId,
        order: count,
      },
    });
  }

  // 🔹 WEBSOCKET – mover tarjeta
  async moveCard({
    cardId,
    fromColumnId,
    toColumnId,
    newOrder,
  }: {
    cardId: string;
    fromColumnId: string;
    toColumnId: string;
    newOrder: number;
  }) {
    // 1️⃣ Reordenar destino
    await this.prisma.card.updateMany({
      where: {
        columnId: toColumnId,
        order: { gte: newOrder },
      },
      data: {
        order: { increment: 1 },
      },
    });

    // 2️⃣ Mover tarjeta
    const card = await this.prisma.card.update({
      where: { id: cardId },
      data: {
        columnId: toColumnId,
        order: newOrder,
      },
    });

    // 3️⃣ Compactar origen
    await this.prisma.card.updateMany({
      where: {
        columnId: fromColumnId,
        order: { gt: card.order },
      },
      data: {
        order: { decrement: 1 },
      },
    });

    return card;
  }
}
