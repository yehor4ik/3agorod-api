import { Price } from './price.model';
import { PriceCreateDto } from './dto/price-create.dto';
import { PriceUpdateDto } from './dto/price-update.dto';

export interface IPriceRepository {
	createPrice: (dto: PriceCreateDto) => Promise<Price | null>;
	getPriceById: (priceId: number) => Promise<Price | null>;
	getAllPrices: () => Promise<Price[]>;
	updatePrice: (currentPrice: Price, dto: PriceUpdateDto) => Promise<Price | null>;
	deletedPriceById: (priceId: number) => Promise<null>;
	createManyPrices: (dto: PriceCreateDto[]) => Promise<Price[] | null>;
}
