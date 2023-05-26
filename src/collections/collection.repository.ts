import { ICollectionRepository } from './collection.repository.interface';
import { ICollectionEntity } from './types/ICollectionEntity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PostgresqlService } from '../database/postgresql.service';
import { CollectionCreateDto } from './dto/collection-create.dto';

@injectable()
export class CollectionRepository implements ICollectionRepository {
	constructor(@inject(TYPES.PostgresqlService) private postgresqlService: PostgresqlService) {}

	async getAllCollections(): Promise<ICollectionEntity[]> {
		const res = await this.postgresqlService.client.query<ICollectionEntity>(
			'SELECT * FROM collection ORDER BY id ASC',
		);
		return res.rows;
	}

	async createCollection(dto: CollectionCreateDto): Promise<ICollectionEntity | null> {
		const { name, background_image } = dto;
		const res = await this.postgresqlService.client.query<ICollectionEntity>(
			'INSERT INTO collection (name, background_image) VALUES ($1, $2) RETURNING *',
			[name, background_image],
		);
		return res?.rows[0] ?? null;
	}

	async getCollectionById(id: number): Promise<ICollectionEntity | null> {
		try {
			const res = await this.postgresqlService.client.query(
				'SELECT * FROM collection WHERE id = $1',
				[id],
			);
			return res?.rows[0] ?? null;
		} catch {
			return null;
		}
	}

	async updateCollection(newCollection: CollectionCreateDto, id: number): Promise<number | null> {
		const collectionsKeys = Object.keys(newCollection).map((key, idx) => `${key} = $${idx + 1}`);
		const collectionsValues = Object.values(newCollection);
		const indexOfId = '$' + (collectionsKeys.length + 1);

		const res = await this.postgresqlService.client.query<ICollectionEntity>(
			`UPDATE collection
             SET ${collectionsKeys}
             WHERE id = ${indexOfId}`,
			[...collectionsValues, id],
		);

		if (res) return id;
		return null;
	}

	async deleteCollection(collectionId: number): Promise<number | null> {
		const res = await this.postgresqlService.client.query('DELETE FROM collection WHERE id = $1', [
			collectionId,
		]);

		if (res) return collectionId;

		return null;
	}
}
