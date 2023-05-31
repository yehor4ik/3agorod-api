import { CollectionCreateDto } from './dto/collection-create.dto';
import { Collection } from './collection.entity';
import { CollectionUpdateDto } from './dto/collection-update.dto';

export interface ICollectionRepository {
	getAllCollections: () => Promise<Collection[]>;
	createCollection: (dto: CollectionCreateDto) => Promise<Collection | null>;
	getCollectionById: (id: number) => Promise<Collection | null>;
	updateCollection: (
		currentCollection: Collection,
		dto: CollectionUpdateDto,
	) => Promise<Collection | null>;
	deleteCollection: (id: number) => Promise<number | null>;
}
