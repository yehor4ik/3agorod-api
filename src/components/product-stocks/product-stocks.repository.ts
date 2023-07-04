import { injectable } from 'inversify';
import { HttpError } from '../../errors/http-error.class';
import { Attributes, CreateOptions, DestroyOptions } from 'sequelize/types/model';
import { IProductStocksRepository } from './product-stocks.repository.interface';
import { ProductStocks } from './product-srocks.model';

@injectable()
export class ProductStocksRepository implements IProductStocksRepository {
	async create(
		dto: ProductStocks[],
		options?: CreateOptions<Attributes<ProductStocks>>,
	): Promise<ProductStocks[]> {
		try {
			return await ProductStocks.bulkCreate(dto, options);
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ProductStocksRepository');
		}
	}
	async deleteByProductId(
		stockId: number,
		options?: DestroyOptions<Attributes<ProductStocks>>,
	): Promise<null> {
		const currentOptions = {
			where: { stockId },
			...(options ?? {}),
		};
		try {
			await ProductStocks.destroy(currentOptions);
			return null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ProductStocksRepository');
		}
	}
}
