import { IImageImageCreationAttributes, Image } from './image.model';
import { Attributes, DestroyOptions, FindOptions } from 'sequelize/types/model';

export interface IImageRepository {
	createImage: (dto: IImageImageCreationAttributes) => Promise<Image | null>;
	deleteImage: (id: number, options?: DestroyOptions<Attributes<Image>>) => Promise<null>;
	getImageById: (id: number) => Promise<Image | null>;
	getAllImages: (options?: FindOptions<Attributes<Image>>) => Promise<Image[]>;
	delete: (options?: DestroyOptions<Attributes<Image>>) => Promise<null>;
}
