import { injectable } from 'inversify';
import { IStockPriceRepository } from './stock-price.repository.interface';
import { StockPrices } from './stock-price.model';
import { HttpError } from '../../errors/http-error.class';
import { Attributes, CreateOptions } from 'sequelize/types/model';

@injectable()
export class StockPriceRepository implements IStockPriceRepository {
	async create(
		dto: StockPrices[],
		options?: CreateOptions<Attributes<StockPrices>>,
	): Promise<StockPrices[]> {
		try {
			return await StockPrices.bulkCreate(dto, options);
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockPriceRepository');
		}
	}
	async getByStockId(stockId: number): Promise<StockPrices[]> {
		try {
			const result = await StockPrices.findAll({ where: { stockId } });
			return result ?? [];
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockPriceRepository');
		}
	}
	async deleteByStockId(stockId: number): Promise<null> {
		try {
			await StockPrices.destroy({ where: { stockId } });
			return null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockPriceRepository');
		}
	}
}
