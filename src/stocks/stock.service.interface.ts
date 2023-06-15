import { StockCreateDto } from './dto/stock-create.dto';
import { HttpError } from '../errors/http-error.class';
import { Stock } from './stock.model';
import { StockUpdateDto } from './dto/stock-update.dto';

export interface IStockService {
	create: (dto: StockCreateDto) => Promise<HttpError | Stock>;
	getAll: () => Promise<HttpError | Stock[]>;
	update: (dto: StockUpdateDto, stockId: string) => Promise<HttpError | Stock>;
	delete: (stockId: string) => Promise<HttpError | null>;
}
