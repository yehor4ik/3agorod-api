import { CollectionCreateDto } from './dto/collection-create.dto';
import { HttpError } from '../errors/http-error.class';
import { Collection } from './collection.entity';

export interface ICollectionService {
	getAllCollections: () => Promise<Collection[] | HttpError>;
	createCollection: (dto: CollectionCreateDto) => Promise<Collection | HttpError>;
	updateCollectionById: (
		dto: CollectionCreateDto,
		collectionId: string,
	) => Promise<Collection | HttpError>;
	deleteCollectionById: (id: string) => Promise<number | HttpError>;
}
