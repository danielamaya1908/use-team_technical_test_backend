import { Injectable, BadRequestException } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';

@Injectable()
export class CardsService {
  private client = new MongoClient('mongodb://localhost:27017');
  private db: any;

  async connect() {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db('kanban');
    }
  }

  private validateObjectId(id: string) {
    if (!ObjectId.isValid(id)) throw new BadRequestException('ID inválido');
  }

  // Crear tarjeta
  async create(dto: { title: string; columnId: string; order?: number }) {
    this.validateObjectId(dto.columnId);
    await this.connect();
    
    const columnExists = await this.db.collection('columns').findOne({ _id: new ObjectId(dto.columnId) });
    if (!columnExists) throw new BadRequestException('La columna no existe');
    
    const nextOrder = dto.order !== undefined ? dto.order : 
      await this.db.collection('cards').countDocuments({ columnId: dto.columnId });
    
    const res = await this.db.collection('cards').insertOne({
      title: dto.title,
      columnId: dto.columnId,
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const newCard = { 
      id: res.insertedId.toString(), 
      title: dto.title, 
      columnId: dto.columnId, 
      order: nextOrder,
    };
    
    console.log(`✅ Tarjeta creada: "${newCard.title}" en columna ${newCard.columnId}`);
    
    return newCard;
  }

  // Obtener todas las tarjetas de una columna
  async findAll(columnId: string) {
    this.validateObjectId(columnId);
    await this.connect();
    
    const cards = await this.db.collection('cards')
      .find({ columnId })
      .sort({ order: 1 })
      .toArray();
    
    return cards.map((card: any) => ({
      id: card._id.toString(),
      title: card.title,
      columnId: card.columnId,
      order: card.order || 0,
    }));
  }

  // Actualizar tarjeta
  async update(cardId: string, dto: { title?: string; order?: number; columnId?: string }) {
    this.validateObjectId(cardId);
    await this.connect();
    
    const card = await this.db.collection('cards').findOne({ _id: new ObjectId(cardId) });
    if (!card) throw new BadRequestException('Tarjeta no encontrada');
    
    const updateData: any = { updatedAt: new Date() };
    if (dto.title !== undefined) updateData.title = dto.title;
    
    if (dto.columnId && dto.columnId !== card.columnId) {
      this.validateObjectId(dto.columnId);
      const newColumnExists = await this.db.collection('columns').findOne({ _id: new ObjectId(dto.columnId) });
      if (!newColumnExists) throw new BadRequestException('La columna de destino no existe');
      updateData.columnId = dto.columnId;
    }
    
    if (dto.order !== undefined) updateData.order = dto.order;
    
    await this.db.collection('cards').updateOne({ _id: new ObjectId(cardId) }, { $set: updateData });
    
    const updatedCard = await this.db.collection('cards').findOne({ _id: new ObjectId(cardId) });
    
    const result = { 
      id: updatedCard._id.toString(),
      title: updatedCard.title,
      columnId: updatedCard.columnId,
      order: updatedCard.order || 0,
    };
    
    console.log(`✅ Tarjeta actualizada: "${result.title}"`);
    
    return result;
  }

  // Mover tarjeta CON REORDENAMIENTO
  async moveCard(dto: { cardId: string; columnId: string; order: number }) {
    const { cardId, columnId, order } = dto;
    
    this.validateObjectId(cardId);
    this.validateObjectId(columnId);
    
    await this.connect();
    
    const card = await this.db.collection('cards').findOne({ _id: new ObjectId(cardId) });
    if (!card) throw new BadRequestException('Tarjeta no encontrada');
    
    const columnExists = await this.db.collection('columns').findOne({ _id: new ObjectId(columnId) });
    if (!columnExists) throw new BadRequestException('La columna de destino no existe');
    
    const oldColumnId = card.columnId;
    const newColumnId = columnId;
    const newOrder = parseInt(order.toString());
    
    console.log(`🔄 Mover tarjeta: ${cardId} de ${oldColumnId} a ${newColumnId}, posición ${newOrder}`);
    
    if (oldColumnId !== newColumnId) {
      await this.db.collection('cards').updateMany(
        { columnId: oldColumnId, order: { $gt: card.order } },
        { $inc: { order: -1 } }
      );
      
      await this.db.collection('cards').updateMany(
        { columnId: newColumnId, order: { $gte: newOrder } },
        { $inc: { order: 1 } }
      );
    } else {
      if (newOrder > card.order) {
        await this.db.collection('cards').updateMany(
          { columnId: oldColumnId, order: { $gt: card.order, $lte: newOrder } },
          { $inc: { order: -1 } }
        );
      } else if (newOrder < card.order) {
        await this.db.collection('cards').updateMany(
          { columnId: oldColumnId, order: { $lt: card.order, $gte: newOrder } },
          { $inc: { order: 1 } }
        );
      }
    }
    
    await this.db.collection('cards').updateOne(
      { _id: new ObjectId(cardId) },
      { $set: { columnId: newColumnId, order: newOrder, updatedAt: new Date() } }
    );
    
    const updatedCard = await this.db.collection('cards').findOne({ _id: new ObjectId(cardId) });
    
    const result = { 
      id: updatedCard._id.toString(),
      title: updatedCard.title,
      columnId: updatedCard.columnId,
      order: updatedCard.order || 0,
    };
    
    console.log(`✅ Tarjeta movida: "${result.title}" a columna ${result.columnId}, posición ${result.order}`);
    
    return result;
  }

  // Eliminar tarjeta
  async delete(cardId: string) {
    this.validateObjectId(cardId);
    await this.connect();
    
    const card = await this.db.collection('cards').findOne({ _id: new ObjectId(cardId) });
    if (!card) throw new BadRequestException('Tarjeta no encontrada');
    
    await this.db.collection('cards').deleteOne({ _id: new ObjectId(cardId) });
    
    await this.db.collection('cards').updateMany(
      { columnId: card.columnId, order: { $gt: card.order } },
      { $inc: { order: -1 } }
    );
    
    console.log(`✅ Tarjeta eliminada: ${cardId}`);
    
    return { id: cardId, columnId: card.columnId, message: 'Tarjeta eliminada' };
  }
}
