import { CollectionCreateDto } from './dto/collection-create.dto';
import { Collection } from './collection.model';

export interface ICollectionService {
	getAllCollections: () => Promise<Collection[]>;
	createCollection: (dto: CollectionCreateDto) => Promise<Collection>;
	updateCollectionById: (dto: CollectionCreateDto, collectionId: string) => Promise<Collection>;
	deleteCollectionById: (id: string) => Promise<null>;
}
