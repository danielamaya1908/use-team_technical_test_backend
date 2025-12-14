import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: { title: string }) {
    const count = await this.prisma.column.count();

    return this.prisma.column.create({
      data: {
        title: dto.title,
        order: count,
      },
    });
  }

  async findAll() {
    return this.prisma.column.findMany({
      orderBy: { order: 'asc' },
      include: {
        cards: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }
}
