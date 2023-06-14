import { IPriceRepository } from './price.repository.interface';
import { PriceCreateDto } from './dto/price-create.dto';
import { Price } from './price.model';
import { injectable } from 'inversify';
import { PriceUpdateDto } from './dto/price-update.dto';

@injectable()
export class PriceRepository implements IPriceRepository {
	async createPrice(dto: PriceCreateDto): Promise<Price | null> {
		const newPrice = await Price.create(dto);
		return newPrice ?? null;
	}
	async getPriceById(priceId: number): Promise<Price | null> {
		const price = await Price.findOne({
			where: { id: priceId },
		});

		return price ?? null;
	}

	async getAllPrices(): Promise<Price[]> {
		const prices = await Price.findAll();
		return prices ?? [];
	}

	async updatePrice(currentPrice: Price, dto: PriceUpdateDto): Promise<Price | null> {
		const updatedPrice = currentPrice.update(dto);

		return updatedPrice ?? null;
	}

	async deletedPriceById(priceId: number): Promise<null> {
		await Price.destroy({ where: { id: priceId } });

		return null;
	}
}
