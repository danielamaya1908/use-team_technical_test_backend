import { Module } from '@nestjs/common';
import { ColumnsModule } from './columns/columns.module';
import { CardsModule } from './cards/cards.module';
import { BoardGateway } from './board/board.gateway';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ColumnsModule,
    CardsModule,
    SharedModule,
  ],
  providers: [BoardGateway],
})
export class AppModule {}