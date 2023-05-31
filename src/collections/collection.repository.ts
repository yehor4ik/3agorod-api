import { ICollectionRepository } from './collection.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PostgresqlService } from '../database/postgresql.service';
import { CollectionCreateDto } from './dto/collection-create.dto';
import { Collection } from './collection.entity';

@injectable()
export class CollectionRepository implements ICollectionRepository {
	constructor(@inject(TYPES.PostgresqlService) private postgresqlService: PostgresqlService) {}

	async getAllCollections(): Promise<Collection[]> {
		return (await Collection.findAll()) ?? [];
	}

	async createCollection(dto: CollectionCreateDto): Promise<Collection | null> {
		const created = await Collection.create(dto);
		return created ?? null;
	}

	async getCollectionById(id: number): Promise<Collection | null> {
		try {
			const collection = await Collection.findByPk(id);

			return collection ?? null;
		} catch {
			return null;
		}
	}

	async updateCollection(
		currentCollection: Collection,
		dto: CollectionCreateDto,
	): Promise<Collection | null> {
		const res = await currentCollection.update(dto);

		return res ?? null;
	}

	async deleteCollection(id: number): Promise<number | null> {
		const res = await Collection.destroy({ where: { id } });

		if (res) return id;

		return null;
	}
}
