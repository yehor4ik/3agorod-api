import { CollectionCreateDto } from './dto/collection-create.dto';
import { Collection } from './collection.model';
import { CollectionUpdateDto } from './dto/collection-update.dto';

export interface ICollectionRepository {
	getAllCollections: () => Promise<Collection[]>;
	createCollection: (dto: CollectionCreateDto) => Promise<Collection>;
	getCollectionById: (id: number) => Promise<Collection | null>;
	updateCollection: (
		currentCollection: Collection,
		dto: CollectionUpdateDto,
	) => Promise<Collection>;
	deleteCollection: (id: number) => Promise<null>;
}
