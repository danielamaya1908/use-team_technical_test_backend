import { Module } from '@nestjs/common';
import { ColumnsModule } from './columns/columns.module';
import { CardsModule } from './cards/cards.module';
import { BoardGateway } from './board/board.gateway';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ColumnsModule,
    CardsModule,
  ],
  providers: [BoardGateway],
})
export class AppModule {}
