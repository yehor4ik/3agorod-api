import { IPriceService } from './price.service.interface';
import { Price } from './price.model';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IPriceRepository } from './price.repository.interface';
import { PriceCreateDto } from './dto/price-create.dto';
import { HttpError } from '../../errors/http-error.class';
import { PriceUpdateDto } from './dto/price-update.dto';

@injectable()
export class PriceService implements IPriceService {
	constructor(@inject(TYPES.PriceRepository) private readonly priceRepository: IPriceRepository) {}
	async create(dto: PriceCreateDto): Promise<Price> {
		const createdPrice = await this.priceRepository.createPrice(dto);

		if (!createdPrice) {
			throw new HttpError(500, 'Price has been not created', 'PriceService');
		}

		return createdPrice;
	}

	async getAll(): Promise<Price[]> {
		return await this.priceRepository.getAllPrices();
	}

	async update(dto: PriceUpdateDto, priceId: string): Promise<Price> {
		const { getPriceById, updatePrice } = this.priceRepository;
		const id: number = +priceId;

		const currentPrice = await getPriceById(+id);

		if (!currentPrice) {
			throw new HttpError(404, `Price with this ID: ${id} is not exist`);
		}

		const updatedPrice = await updatePrice(currentPrice, dto);
		if (!updatedPrice) {
			throw new HttpError(500, `Failed to update the price with ${id}`);
		}
		return updatedPrice;
	}

	async delete(priceId: string): Promise<null> {
		const id: number = +priceId;

		return await this.priceRepository.deletedPriceById(id);
	}
}
