import { injectable } from 'inversify';
import { IStockRepository } from './stock.repository.interface';
import { IStockCreationAttributes, Stock } from './stock.model';
import { StockUpdateDto } from './dto/stock-update.dto';
import { HttpError } from '../../errors/http-error.class';
import { Error } from 'sequelize';

@injectable()
export class StockRepository implements IStockRepository {
	async create(dto: IStockCreationAttributes): Promise<Stock | null> {
		try {
			const newStock = await Stock.create(dto);
			return newStock ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockRepository');
		}
	}
	async getById(stockId: number): Promise<Stock | null> {
		try {
			const stock = await Stock.findOne({
				where: { id: stockId },
			});

			return stock ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockRepository');
		}
	}

	async getAll(): Promise<Stock[]> {
		try {
			const stocks = await Stock.findAll();
			return stocks ?? [];
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockRepository');
		}
	}

	async update(currentStock: Stock, dto: StockUpdateDto): Promise<Stock | null> {
		try {
			const updatedStock = currentStock.update(dto);

			return updatedStock ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockRepository');
		}
	}

	async deletedById(stockId: number): Promise<null> {
		try {
			await Stock.destroy({ where: { id: stockId } });

			return null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockRepository');
		}
	}
}
