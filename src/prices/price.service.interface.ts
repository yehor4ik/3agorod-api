import { Price } from './price.model';
import { HttpError } from '../errors/http-error.class';
import { PriceCreateDto } from './dto/price-create.dto';
import { PriceUpdateDto } from './dto/price-update.dto';

export interface IPriceService {
	create: (dto: PriceCreateDto) => Promise<HttpError | Price>;
	getAll: () => Promise<HttpError | Price[]>;
	update: (dto: PriceUpdateDto, id: string) => Promise<HttpError | Price>;
	delete: (priceId: string) => Promise<HttpError | null>;
}
