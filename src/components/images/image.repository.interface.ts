import { IImageImageCreationAttributes, Image } from './image.model';

export interface IImageRepository {
	createImage: (dto: IImageImageCreationAttributes) => Promise<Image | null>;
	deleteImage: (id: number) => Promise<null>;
	getImageById: (id: number) => Promise<Image | null>;
}
