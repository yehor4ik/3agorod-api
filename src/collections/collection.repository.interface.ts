import { ICollectionEntity } from './types/ICollectionEntity';
import { CollectionCreateDto } from './dto/collection-create.dto';

export interface ICollectionRepository {
	getAllCollections: () => Promise<ICollectionEntity[]>;
	createCollection: (dto: CollectionCreateDto) => Promise<ICollectionEntity | null>;
	getCollectionById: (id: number) => Promise<ICollectionEntity | null>;
	updateCollection: (dto: CollectionCreateDto, id: number) => Promise<number | null>;
	deleteCollection: (id: number) => Promise<number | null>;
}
