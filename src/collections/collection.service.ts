import { ICollectionService } from './collection.service.interface';
import { ICollectionEntity } from './types/ICollectionEntity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ICollectionRepository } from './collection.repository.interface';
import { CollectionCreateDto } from './dto/collection-create.dto';
import { HttpError } from '../errors/http-error.class';

@injectable()
export class CollectionService implements ICollectionService {
	constructor(
		@inject(TYPES.CollectionRepository)
		private readonly collectionRepository: ICollectionRepository,
	) {}
	async getAllCollections(): Promise<ICollectionEntity[] | HttpError> {
		try {
			return await this.collectionRepository.getAllCollections();
		} catch (e) {
			return new HttpError(500, (e as Error).message);
		}
	}
	async createCollection(dto: CollectionCreateDto): Promise<ICollectionEntity | HttpError> {
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
	): Promise<number | HttpError> {
		const { getCollectionById, updateCollection } = this.collectionRepository;
		const id: number = +collectionId;
		try {
			const currentCollection = await getCollectionById(+id);

			if (!currentCollection) {
				return new HttpError(404, `Collection with this ID: ${id} is not exist`);
			}

			const newCollection = { ...currentCollection, ...dto };
			const updatedCollection = await updateCollection(newCollection, id);
			return updatedCollection ?? new HttpError(500, `Failed to update the collection with ${id}`);
		} catch (e) {
			return new HttpError(500, (e as Error).message);
		}
	}
	async deleteCollectionById(collectionId: string): Promise<number | HttpError> {
		try {
			const { getCollectionById, deleteCollection } = this.collectionRepository;
			const id: number = +collectionId;
			const currentCollection = await getCollectionById(+id);

			if (!currentCollection) {
				return new HttpError(404, `Collection with this ID: ${id} is not exist`);
			}

			const deletedCollection = await deleteCollection(id);
			return deletedCollection ?? new HttpError(500, `Failed to remove the collection with ${id}`);
		} catch (e) {
			return new HttpError(500, (e as Error).message);
		}
	}
}
