import { ICollectionService } from './collection.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ICollectionRepository } from './collection.repository.interface';
import { CollectionCreateDto } from './dto/collection-create.dto';
import { HttpError } from '../../errors/http-error.class';
import { Collection } from './collection.model';

@injectable()
export class CollectionService implements ICollectionService {
	constructor(
		@inject(TYPES.CollectionRepository)
		private readonly collectionRepository: ICollectionRepository,
	) {}
	async getAllCollections(): Promise<Collection[]> {
		return await this.collectionRepository.getAllCollections();
	}
	async createCollection(dto: CollectionCreateDto): Promise<Collection> {
		const createdCollection = await this.collectionRepository.createCollection(dto);
		if (!createdCollection) {
			throw new HttpError(409, `${dto.name} this collection already exists`, 'CollectionService');
		}
		const result = await this.collectionRepository.getCollectionById(createdCollection.id);

		if (!result) {
			throw new HttpError(409, `${dto.name} this collection already exists`, 'CollectionService');
		}
		return result;
	}
	async updateCollectionById(dto: CollectionCreateDto, collectionId: string): Promise<Collection> {
		const { getCollectionById, updateCollection } = this.collectionRepository;
		const id: number = +collectionId;
		const currentCollection = await getCollectionById(+id);

		if (!currentCollection) {
			throw new HttpError(404, `Collection with this ID: ${id} is not exist`, 'CollectionService');
		}

		const updatedCollection = await updateCollection(currentCollection, dto);

		const result = await this.collectionRepository.getCollectionById(updatedCollection.id);

		if (!result) {
			throw new HttpError(404, `Collection with this ID: ${id} is not exist`, 'CollectionService');
		}
		return result;
	}
	async deleteCollectionById(collectionId: string): Promise<null> {
		const { getCollectionById, deleteCollection } = this.collectionRepository;
		const id: number = +collectionId;
		const currentCollection = await getCollectionById(+id);

		if (!currentCollection) {
			throw new HttpError(404, `Collection with this ID: ${id} is not exist`, 'CollectionService');
		}

		return await deleteCollection(id);
	}
}
