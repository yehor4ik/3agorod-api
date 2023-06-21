import { Price } from './price.model';
import { PriceCreateDto } from './dto/price-create.dto';
import { PriceUpdateDto } from './dto/price-update.dto';

export interface IPriceService {
	create: (dto: PriceCreateDto) => Promise<Price>;
	getAll: () => Promise<Price[]>;
	update: (dto: PriceUpdateDto, id: string) => Promise<Price>;
	delete: (priceId: string) => Promise<null>;
}
