import { StockCreateDto } from './dto/stock-create.dto';
import { Stock } from './stock.model';
import { StockUpdateDto } from './dto/stock-update.dto';
import { ICreateStockResponse } from './types/create-stock-response.interface';

export interface IStockService {
	create: (dto: StockCreateDto) => Promise<ICreateStockResponse>;
	getAll: () => Promise<Stock[]>;
	update: (dto: StockUpdateDto, stockId: string) => Promise<Stock>;
	delete: (stockId: string) => Promise<null>;
}
