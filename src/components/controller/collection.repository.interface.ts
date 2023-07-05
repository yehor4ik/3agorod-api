import { CollectionCreateDto } from './dto/collection-create.dto';
import { Collection } from './collection.model';
import { CollectionUpdateDto } from './dto/collection-update.dto';
import { Attributes, FindOptions } from 'sequelize/types/model';

export interface ICollectionRepository {
	getAllCollections: (options?: FindOptions<Attributes<Collection>>) => Promise<Collection[]>;
	createCollection: (dto: CollectionCreateDto) => Promise<Collection>;
	getCollectionById: (id: number) => Promise<Collection | null>;
	updateCollection: (
		currentCollection: Collection,
		dto: CollectionUpdateDto,
	) => Promise<Collection>;
	deleteCollection: (id: number) => Promise<null>;
}
