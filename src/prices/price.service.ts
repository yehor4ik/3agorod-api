import { IPriceService } from './price.service.interface';
import { Price } from './price.model';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IPriceRepository } from './price.repository.interface';
import { PriceCreateDto } from './dto/price-create.dto';
import { HttpError } from '../errors/http-error.class';
import { PriceUpdateDto } from './dto/price-update.dto';

@injectable()
export class PriceService implements IPriceService {
	constructor(@inject(TYPES.PriceRepository) private readonly priceRepository: IPriceRepository) {}
	async create(dto: PriceCreateDto): Promise<Price | HttpError> {
		const error = new HttpError(500, 'Price has not been saved');
		try {
			const createdPrice = await this.priceRepository.createPrice(dto);
			return createdPrice ?? error;
		} catch (e) {
			return error;
		}
	}

	async getAll(): Promise<HttpError | Price[]> {
		try {
			return await this.priceRepository.getAllPrices();
		} catch (e) {
			return new HttpError(500, (e as Error).message);
		}
	}

	async update(dto: PriceUpdateDto, priceId: string): Promise<HttpError | Price> {
		try {
			const { getPriceById, updatePrice } = this.priceRepository;
			const id: number = +priceId;

			const currentPrice = await getPriceById(+id);

			if (!currentPrice) {
				return new HttpError(404, `Price with this ID: ${id} is not exist`);
			}

			const updatedPrice = await updatePrice(currentPrice, dto);
			return updatedPrice ?? new HttpError(500, `Failed to update the price with ${id}`);
		} catch (e) {
			return new HttpError(500, (e as Error).message, 'PriceService');
		}
	}

	async delete(priceId: string): Promise<HttpError | null> {
		try {
			const { getPriceById, deletedPriceById } = this.priceRepository;
			const id: number = +priceId;
			const currentPrice = await getPriceById(+id);

			if (!currentPrice) {
				return new HttpError(404, `Price with this ID: ${id} is not exist`);
			}

			const deletedPrice = await deletedPriceById(id);
			const isNull = deletedPrice === null;
			const errorMessage = new HttpError(500, `Failed to remove the price with ${id}`);

			return isNull ? deletedPrice : errorMessage;
		} catch (e) {
			return new HttpError(500, (e as Error).message, 'PriceService');
		}
	}
}
