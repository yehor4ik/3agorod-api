import { ICollectionService } from './collection.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ICollectionRepository } from './collection.repository.interface';
import { CollectionCreateDto } from './dto/collection-create.dto';
import { HttpError } from '../errors/http-error.class';
import { Collection } from './collection.model';

@injectable()
export class CollectionService implements ICollectionService {
	constructor(
		@inject(TYPES.CollectionRepository)
		private readonly collectionRepository: ICollectionRepository,
	) {}
	async getAllCollections(): Promise<Collection[] | HttpError> {
		try {
			return await this.collectionRepository.getAllCollections();
		} catch (e) {
			return new HttpError(500, (e as Error).message);
		}
	}
	async createCollection(dto: CollectionCreateDto): Promise<Collection | HttpError> {
		try {
			const createdCollection = await this.collectionRepository.createCollection(dto);
			return createdCollection ?? new HttpError(409, dto.name + ' this collection already exists');
		} catch (e) {
			return new HttpError(500, (e as Error).message);
		}
	}
	async updateCollectionById(
		dto: CollectionCreateDto,
		collectionId: string,
	): Promise<Collection | HttpError> {
		const { getCollectionById, updateCollection } = this.collectionRepository;
		const id: number = +collectionId;
		try {
			const currentCollection = await getCollectionById(+id);

			if (!currentCollection) {
				return new HttpError(404, `Collection with this ID: ${id} is not exist`);
			}

			const updatedCollection = await updateCollection(currentCollection, dto);
			return updatedCollection ?? new HttpError(500, `Failed to update the collection with ${id}`);
		} catch (e) {
			return new HttpError(500, (e as Error).message);
		}
	}
	async deleteCollectionById(collectionId: string): Promise<null | HttpError> {
		try {
			const { getCollectionById, deleteCollection } = this.collectionRepository;
			const id: number = +collectionId;
			const currentCollection = await getCollectionById(+id);

			if (!currentCollection) {
				return new HttpError(404, `Collection with this ID: ${id} is not exist`);
			}

			const deletedCollection = await deleteCollection(id);
			const isNull = deletedCollection === null;
			const errorMessage = new HttpError(500, `Failed to remove the collection with ${id}`);

			return isNull ? deletedCollection : errorMessage;
		} catch (e) {
			return new HttpError(500, (e as Error).message);
		}
	}
}
