import { StockPrice } from './stock-price.model';

export interface IStockPriceRepository {
	create: (dto: StockPrice[]) => Promise<StockPrice[] | null>;
	getByStockId: (stockId: number) => Promise<StockPrice[]>;
	deleteByStockId: (stockId: number) => Promise<null>;
}
