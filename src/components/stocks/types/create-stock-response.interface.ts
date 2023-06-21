import { SizeTypes } from '../stock.model';
import { PriceCreateDto } from '../../prices/dto/price-create.dto';

export interface ICreateStockResponse {
	quantity: number;
	size: SizeTypes;
	prices: PriceCreateDto[];
}
