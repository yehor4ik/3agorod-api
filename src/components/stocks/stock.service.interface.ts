import { StockCreateDto } from './dto/stock-create.dto';
import { Stock } from './stock.model';
import { StockUpdateDto } from './dto/stock-update.dto';

export interface IStockService {
	create: (dto: StockCreateDto) => Promise<Stock>;
	getAll: () => Promise<Stock[]>;
	update: (dto: StockUpdateDto, stockId: string) => Promise<Stock>;
	delete: (stockId: string) => Promise<null>;
}
