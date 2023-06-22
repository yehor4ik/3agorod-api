import { StockPrices } from './stock-price.model';

export interface IStockPriceRepository {
	create: (dto: StockPrices[]) => Promise<StockPrices[] | null>;
	getByStockId: (stockId: number) => Promise<StockPrices[]>;
	deleteByStockId: (stockId: number) => Promise<null>;
}
