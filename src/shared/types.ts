export interface CardDto {
  id: string;
  title: string;
  columnId: string;
  order: number;
}

export interface ColumnDto {
  id: string;
  title: string;
  order: number;
  cards: CardDto[];
}

export interface MoveCardDto {
  cardId: string;
  columnId: string;
  order: number;
}