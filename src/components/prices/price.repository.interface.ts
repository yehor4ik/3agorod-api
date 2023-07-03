import { Price } from './price.model';
import { PriceCreateDto } from './dto/price-create.dto';
import { PriceUpdateDto } from './dto/price-update.dto';
import { Attributes, CreateOptions, DestroyOptions, UpdateOptions } from 'sequelize/types/model';

export interface IPriceRepository {
	createPrice: (dto: PriceCreateDto) => Promise<Price | null>;
	getPriceById: (priceId: number) => Promise<Price | null>;
	getAllPrices: () => Promise<Price[]>;
	updatePrice: (currentPrice: Price, dto: PriceUpdateDto) => Promise<Price | null>;
	deletedPriceById: (priceId: number, options?: DestroyOptions<Attributes<Price>>) => Promise<null>;
	createManyPrices: (
		dto: PriceCreateDto[],
		options?: CreateOptions<Attributes<Price>>,
	) => Promise<Price[]>;
	updatePriceById: (
		id: number,
		dto: PriceUpdateDto,
		options?: Omit<UpdateOptions<Attributes<Price>>, 'where'>,
	) => Promise<Price>;
}
