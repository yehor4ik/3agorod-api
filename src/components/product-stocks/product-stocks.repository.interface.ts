import { Attributes, CreateOptions, DestroyOptions } from 'sequelize/types/model';
import { ProductStocks } from './product-srocks.model';

export interface IProductStocksRepository {
	create: (
		dto: ProductStocks[],
		options?: CreateOptions<Attributes<ProductStocks>>,
	) => Promise<ProductStocks[]>;
	deleteByProductId: (
		productId: number,
		options?: DestroyOptions<Attributes<ProductStocks>>,
	) => Promise<null>;
}
