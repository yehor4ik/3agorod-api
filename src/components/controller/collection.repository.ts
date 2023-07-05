import { ICollectionRepository } from './collection.repository.interface';
import { injectable } from 'inversify';
import { CollectionCreateDto } from './dto/collection-create.dto';
import { Collection } from './collection.model';
import { Image } from '../images/image.model';
import { HttpError } from '../../errors/http-error.class';
import { Attributes, FindOptions } from 'sequelize/types/model';

@injectable()
export class CollectionRepository implements ICollectionRepository {
	async getAllCollections(options?: FindOptions<Attributes<Collection>>): Promise<Collection[]> {
		try {
			const collections = await Collection.findAll({
				include: [{ model: Image, as: 'backgroundImage' }],
				...(options ?? {}),
			});
			return collections ?? [];
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'CollectionRepository');
		}
	}

	async createCollection(dto: CollectionCreateDto): Promise<Collection> {
		try {
			return await Collection.create(dto);
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'CollectionRepository');
		}
	}

	async getCollectionById(id: number): Promise<Collection | null> {
		try {
			const collection = await Collection.findByPk(id, {
				include: [{ model: Image, as: 'backgroundImage' }],
			});

			return collection ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'CollectionRepository');
		}
	}

	async updateCollection(
		currentCollection: Collection,
		dto: CollectionCreateDto,
	): Promise<Collection> {
		try {
			return await currentCollection.update(dto);
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'CollectionRepository');
		}
	}

	async deleteCollection(id: number): Promise<null> {
		try {
			await Collection.destroy({ where: { id } });

			return null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'CollectionRepository');
		}
	}
}
