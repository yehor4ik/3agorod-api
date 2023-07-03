import { injectable } from 'inversify';
import { HttpError } from '../../errors/http-error.class';
import { Error } from 'sequelize';
import {
	Attributes,
	CreateOptions,
	DestroyOptions,
	FindOptions,
	InstanceUpdateOptions,
} from 'sequelize/types/model';
import { IProductRepository } from './product.repository.interface';
import { IProductCreationAttributes, Product } from './product.model';
import { Image } from '../images/image.model';
import { Stock } from '../stocks/stock.model';
import { Price } from '../prices/price.model';

@injectable()
export class ProductRepository implements IProductRepository {
	async create(
		dto: IProductCreationAttributes,
		options?: CreateOptions<Attributes<Product>>,
	): Promise<Product> {
		const currentOptions: CreateOptions<Attributes<Product>> = {
			...options,
		};
		try {
			return await Product.create(dto, currentOptions);
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ProductRepository.create');
		}
	}
	async getById(
		productId: number,
		options?: FindOptions<Attributes<Product>>,
	): Promise<Product | null> {
		const currentOption: FindOptions<Attributes<Product>> = {
			where: { id: productId },
			include: [
				{
					model: Image,
					through: { attributes: [] },
					as: 'images',
				},
				{
					model: Stock,
					through: { attributes: [] },
					as: 'stocks',
					include: [
						{
							model: Price,
							through: { attributes: [] },
							as: 'prices',
						},
					],
				},
			],
			...(options ?? {}),
		};

		try {
			return await Product.findOne(currentOption);
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ProductRepository.getById');
		}
	}

	async getAll(): Promise<Product[]> {
		try {
			const stocks = await Product.findAll({
				include: [
					{
						model: Image,
						through: { attributes: [] },
						as: 'images',
					},
					{
						model: Stock,
						through: { attributes: [] },
						as: 'stocks',
						include: [
							{
								model: Price,
								through: { attributes: [] },
								as: 'prices',
							},
						],
					},
				],
			});
			return stocks ?? [];
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ProductRepository.getAll');
		}
	}

	async update(
		currentProduct: Product,
		dto: IProductCreationAttributes,
		options?: InstanceUpdateOptions<IProductCreationAttributes>,
	): Promise<Product> {
		try {
			const currentOptions = {
				include: [
					{
						model: Image,
						through: { attributes: [] },
						as: 'images',
					},
					{
						model: Stock,
						through: { attributes: [] },
						as: 'stocks',
					},
				],
				returning: true,
				...(options ?? {}),
			};

			return await currentProduct.update(dto, currentOptions);
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ProductRepository.update');
		}
	}

	async deletedById(
		productId: number,
		options?: DestroyOptions<Attributes<Product>>,
	): Promise<null> {
		try {
			const currentOptions = {
				where: { id: productId },
				...(options ?? {}),
			};
			await Product.destroy(currentOptions);

			return null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ProductRepository.deletedById');
		}
	}
}
