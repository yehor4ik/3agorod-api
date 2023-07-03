import { Attributes, CreateOptions, DestroyOptions, UpdateOptions } from 'sequelize/types/model';
import { ProductImages } from './product-images.model';

export interface IUpdateImageIdQuery {
	productId: number;
	imageId: number;
	newImageId: number;
}
export interface IProductImagesRepository {
	create: (
		dto: ProductImages[],
		options?: CreateOptions<Attributes<ProductImages>>,
	) => Promise<ProductImages[]>;
	updateImageId: (
		query: IUpdateImageIdQuery,
		options?: Omit<UpdateOptions<Attributes<ProductImages>>, 'where'>,
	) => Promise<ProductImages>;
	deleteByProductId: (
		productId: number,
		options?: DestroyOptions<Attributes<ProductImages>>,
	) => Promise<null>;
}
