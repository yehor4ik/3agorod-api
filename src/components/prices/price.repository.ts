import { IPriceRepository } from './price.repository.interface';
import { PriceCreateDto } from './dto/price-create.dto';
import { Price } from './price.model';
import { injectable } from 'inversify';
import { PriceUpdateDto } from './dto/price-update.dto';
import { HttpError } from '../../errors/http-error.class';
import { Attributes, CreateOptions, UpdateOptions } from 'sequelize/types/model';

@injectable()
export class PriceRepository implements IPriceRepository {
	async createPrice(dto: PriceCreateDto): Promise<Price | null> {
		try {
			const newPrice = await Price.create(dto);
			return newPrice ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'PriceRepository');
		}
	}

	async createManyPrices(
		dto: PriceCreateDto[],
		options?: CreateOptions<Attributes<Price>>,
	): Promise<Price[]> {
		try {
			return await Price.bulkCreate(dto, options);
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'PriceRepository');
		}
	}
	async getPriceById(priceId: number): Promise<Price | null> {
		try {
			const price = await Price.findOne({
				where: { id: priceId },
			});

			return price ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'PriceRepository');
		}
	}

	async getAllPrices(): Promise<Price[]> {
		try {
			const prices = await Price.findAll();
			return prices ?? [];
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'PriceRepository');
		}
	}

	async updatePrice(currentPrice: Price, dto: PriceUpdateDto): Promise<Price | null> {
		try {
			const updatedPrice = currentPrice.update(dto);

			return updatedPrice ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'PriceRepository');
		}
	}

	async updatePriceById(
		id: number,
		dto: PriceUpdateDto,
		options?: Omit<UpdateOptions<Attributes<Price>>, 'where'>,
	): Promise<Price> {
		try {
			const currentOptions: UpdateOptions<Attributes<Price>> = {
				where: { id },
				returning: true,
				...(options ?? {}),
			};
			const result = await Price.update(dto, currentOptions);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return result[1][0];
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'PriceRepository');
		}
	}

	async deletedPriceById(priceId: number): Promise<null> {
		try {
			await Price.destroy({ where: { id: priceId } });

			return null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'PriceRepository');
		}
	}
}
