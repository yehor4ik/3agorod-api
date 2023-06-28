import { StockPrices } from './stock-price.model';
import { Attributes, CreateOptions } from 'sequelize/types/model';

export interface IStockPriceRepository {
	create: (
		dto: StockPrices[],
		options?: CreateOptions<Attributes<StockPrices>>,
	) => Promise<StockPrices[]>;
	getByStockId: (stockId: number) => Promise<StockPrices[]>;
	deleteByStockId: (stockId: number) => Promise<null>;
}
