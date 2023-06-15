import { StockCreateDto } from './dto/stock-create.dto';
import { Stock } from './stock.model';
import { StockUpdateDto } from './dto/stock-update.dto';

export interface IStockRepository {
	create: (dto: StockCreateDto) => Promise<Stock | null>;
	getById: (stockId: number) => Promise<Stock | null>;
	getAll: () => Promise<Stock[]>;
	update: (currentStock: Stock, dto: StockUpdateDto) => Promise<Stock | null>;
	deletedById: (stockId: number) => Promise<null>;
}
