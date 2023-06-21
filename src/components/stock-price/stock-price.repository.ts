import { injectable } from 'inversify';
import { IStockPriceRepository } from './stock-price.repository.interface';
import { StockPrice } from './stock-price.model';
import { HttpError } from '../../errors/http-error.class';

@injectable()
export class StockPriceRepository implements IStockPriceRepository {
	async create(dto: StockPrice[]): Promise<StockPrice[] | null> {
		try {
			const result = await StockPrice.bulkCreate(dto);
			return result ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockPriceRepository');
		}
	}
	async getByStockId(stockId: number): Promise<StockPrice[]> {
		try {
			const result = await StockPrice.findAll({ where: { stockId } });
			return result ?? [];
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockPriceRepository');
		}
	}
	async deleteByStockId(stockId: number): Promise<null> {
		try {
			await StockPrice.destroy({ where: { stockId } });
			return null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockPriceRepository');
		}
	}
}
