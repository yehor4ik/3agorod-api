import { Attributes, CreateOptions, DestroyOptions } from 'sequelize/types/model';
import { ProductImages } from './product-images.model';

export interface IProductImagesRepository {
	create: (
		dto: ProductImages[],
		options?: CreateOptions<Attributes<ProductImages>>,
	) => Promise<ProductImages[]>;
	deleteByProductId: (
		productId: number,
		options?: DestroyOptions<Attributes<ProductImages>>,
	) => Promise<null>;
}
