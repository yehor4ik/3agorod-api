import { injectable } from 'inversify';
import { IStockRepository } from './stock.repository.interface';
import { IStockCreationAttributes, Stock } from './stock.model';
import { StockUpdateDto } from './dto/stock-update.dto';
import { HttpError } from '../../errors/http-error.class';
import { Error } from 'sequelize';
import { Price } from '../prices/price.model';

@injectable()
export class StockRepository implements IStockRepository {
	async create(dto: IStockCreationAttributes): Promise<Stock | null> {
		try {
			const newStock = await Stock.create(dto);
			return newStock ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockRepository.create');
		}
	}
	async getById(stockId: number): Promise<Stock | null> {
		try {
			const stock = await Stock.findOne({
				where: { id: stockId },
				include: {
					model: Price,
					through: { attributes: [] },
					as: 'prices',
				},
			});

			return stock ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockRepository.getById');
		}
	}

	async getAll(): Promise<Stock[]> {
		try {
			const stocks = await Stock.findAll();
			return stocks ?? [];
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockRepository.getAll');
		}
	}

	async update(currentStock: Stock, dto: StockUpdateDto): Promise<Stock | null> {
		try {
			const updatedStock = currentStock.update(dto);

			return updatedStock ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockRepository.update');
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
