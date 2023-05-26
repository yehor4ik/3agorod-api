import { ICollectionEntity } from './types/ICollectionEntity';
import { CollectionCreateDto } from './dto/collection-create.dto';
import { HttpError } from '../errors/http-error.class';

export interface ICollectionService {
	getAllCollections: () => Promise<ICollectionEntity[] | HttpError>;
	createCollection: (dto: CollectionCreateDto) => Promise<ICollectionEntity | HttpError>;
	updateCollectionById: (
		dto: CollectionCreateDto,
		collectionId: string,
	) => Promise<number | HttpError>;
	deleteCollectionById: (id: string) => Promise<number | HttpError>;
}
