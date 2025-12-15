import { Injectable, BadRequestException } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';

@Injectable()
export class ColumnsService {
  private client = new MongoClient('mongodb://localhost:27017');
  private db: any;

  // NO inyectes SocketService aquí si no está configurado correctamente
  // constructor() {} - Déjalo vacío por ahora

  async connect() {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db('kanban');
    }
  }

  private validateObjectId(id: string) {
    if (!ObjectId.isValid(id)) throw new BadRequestException('ID inválido');
  }

  async create(dto: { title: string }) {
    await this.connect();
    const res = await this.db.collection('columns').insertOne({
      title: dto.title,
      order: 0,
      createdAt: new Date(),
    });
    
    const newColumn = { 
      id: res.insertedId.toString(), 
      title: dto.title, 
      order: 0,
      cards: [],
    };
    
    // TEMPORALMENTE: No emitas eventos hasta que se configure SocketService
    console.log(`✅ Columna creada: "${newColumn.title}"`);
    
    return newColumn;
  }

  async findAll() {
    await this.connect();
    const columns = await this.db.collection('columns').find().toArray();

    const result = await Promise.all(
      columns.map(async (col) => {
        const cards = await this.db.collection('cards')
          .find({ columnId: col._id.toString() })
          .sort({ order: 1 })
          .toArray();
        
        const normalizedCards = cards.map(card => ({
          id: card._id.toString(),
          title: card.title,
          columnId: card.columnId,
          order: card.order || 0,
        }));

        return { 
          ...col, 
          id: col._id.toString(),
          cards: normalizedCards,
        };
      })
    );

    return result;
  }

  async findOne(id: string) {
    this.validateObjectId(id);
    await this.connect();
    const column = await this.db.collection('columns').findOne({ 
      _id: new ObjectId(id) 
    });
    
    if (!column) return null;
    
    const cards = await this.db.collection('cards')
      .find({ columnId: id })
      .sort({ order: 1 })
      .toArray();
    
    const normalizedCards = cards.map(card => ({
      id: card._id.toString(),
      title: card.title,
      columnId: card.columnId,
      order: card.order || 0,
    }));

    return { 
      ...column, 
      id: column._id.toString(),
      cards: normalizedCards,
    };
  }

  async update(id: string, dto: { title?: string; order?: number }) {
    this.validateObjectId(id);
    await this.connect();
    
    await this.db.collection('columns').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...dto, updatedAt: new Date() } }
    );
    
    const updated = await this.db.collection('columns').findOne({ 
      _id: new ObjectId(id) 
    });
    
    if (!updated) throw new BadRequestException('Columna no encontrada');
    
    const result = { 
      id: updated._id.toString(),
      title: updated.title,
      order: updated.order || 0,
    };
    
    console.log(`✅ Columna actualizada: "${result.title}"`);
    
    return result;
  }

  async delete(id: string) {
    this.validateObjectId(id);
    await this.connect();
    
    const column = await this.db.collection('columns').findOne({ 
      _id: new ObjectId(id) 
    });
    
    if (!column) throw new BadRequestException('Columna no encontrada');
    
    await this.db.collection('columns').deleteOne({ _id: new ObjectId(id) });
    await this.db.collection('cards').deleteMany({ columnId: id });
    
    console.log(`✅ Columna eliminada: ${id}`);
    
    return { 
      id,
      message: 'Columna y sus tarjetas eliminadas',
    };
  }

  async reorderColumns(columnIds: string[]) {
    await this.connect();
    
    for (let i = 0; i < columnIds.length; i++) {
      await this.db.collection('columns').updateOne(
        { _id: new ObjectId(columnIds[i]) },
        { $set: { order: i } }
      );
    }
    
    console.log(`✅ Columnas reordenadas`);
    
    return { message: 'Columnas reordenadas', columnIds };
  }
}