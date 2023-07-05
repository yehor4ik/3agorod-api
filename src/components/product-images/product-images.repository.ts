import { injectable } from 'inversify';
import { HttpError } from '../../errors/http-error.class';
import {
	Attributes,
	CreateOptions,
	DestroyOptions,
	FindOptions,
	UpdateOptions,
} from 'sequelize/types/model';
import {
	IProductImagesRepository,
	IUpdateImageIdQuery,
} from './product-images.repository.interface';
import { ProductImages } from './product-images.model';
import { Op } from 'sequelize';

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

	async updateImageId(
		query: IUpdateImageIdQuery,
		options?: Omit<UpdateOptions<Attributes<ProductImages>>, 'where'>,
	): Promise<ProductImages> {
		const { productId, imageId, newImageId } = query;
		const currentOptions: UpdateOptions<Attributes<ProductImages>> = {
			where: {
				[Op.and]: [{ productId }, { imageId }],
			},
			returning: true,
			...(options ?? {}),
		};
		try {
			const result = await ProductImages.update({ imageId: newImageId }, currentOptions);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return result[1][0];
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ProductImagesRepository');
		}
	}
	async deleteByProductId(
		productId: number,
		options?: DestroyOptions<Attributes<ProductImages>>,
	): Promise<null> {
		const currentOptions: DestroyOptions<Attributes<ProductImages>> = {
			where: { productId },
			...(options ?? {}),
		};
		try {
			await ProductImages.destroy(currentOptions);
			return null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ProductImagesRepository');
		}
	}

	async getAll(options?: FindOptions<Attributes<ProductImages>>): Promise<ProductImages[]> {
		try {
			return await ProductImages.findAll(options);
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ProductImagesRepository');
		}
	}
}
