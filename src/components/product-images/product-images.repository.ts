import { injectable } from 'inversify';
import { HttpError } from '../../errors/http-error.class';
import { Attributes, CreateOptions, DestroyOptions } from 'sequelize/types/model';
import { IProductImagesRepository } from './product-images.repository.interface';
import { ProductImages } from './product-images.model';

@injectable()
export class ProductImagesRepository implements IProductImagesRepository {
	async create(
		dto: ProductImages[],
		options?: CreateOptions<Attributes<ProductImages>>,
	): Promise<ProductImages[]> {
		try {
			return await ProductImages.bulkCreate(dto, options);
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ProductImagesRepository');
		}
	}
	async deleteByProductId(
		stockId: number,
		options?: DestroyOptions<Attributes<ProductImages>>,
	): Promise<null> {
		const currentOptions = {
			where: { stockId },
			...(options ?? {}),
		};
		try {
			await ProductImages.destroy(currentOptions);
			return null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ProductImagesRepository');
		}
	}
}
