import { injectable } from 'inversify';
import { IStockPriceRepository } from './stock-price.repository.interface';
import { StockPrice } from './stock-price.model';

@injectable()
export class StockPriceRepository implements IStockPriceRepository {
	async create(dto: StockPrice[]): Promise<StockPrice[] | null> {
		const result = await StockPrice.bulkCreate(dto);
		return result ?? null;
	}
	async getByStockId(stockId: number): Promise<StockPrice[]> {
		const result = await StockPrice.findAll({ where: { stockId } });
		return result ?? [];
	}
	async deleteByStockId(stockId: number): Promise<null> {
		await StockPrice.destroy({ where: { stockId } });
		return null;
	}
}
