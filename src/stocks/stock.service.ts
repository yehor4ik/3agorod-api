import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { HttpError } from '../errors/http-error.class';
import { IStockService } from './stock.service.interface';
import { StockCreateDto } from './dto/stock-create.dto';
import { StockUpdateDto } from './dto/stock-update.dto';
import { Stock } from './stock.model';
import { IStockRepository } from './stock.repository.interface';

@injectable()
export class StockService implements IStockService {
	constructor(@inject(TYPES.StockRepository) private readonly stockRepository: IStockRepository) {}
	async create(dto: StockCreateDto): Promise<Stock | HttpError> {
		const error = new HttpError(500, 'Stock has not been saved');
		try {
			const createdStock = await this.stockRepository.create(dto);
			return createdStock ?? error;
		} catch (e) {
			return error;
		}
	}

	async getAll(): Promise<HttpError | Stock[]> {
		try {
			return await this.stockRepository.getAll();
		} catch (e) {
			return new HttpError(500, (e as Error).message);
		}
	}

	async update(dto: StockUpdateDto, stockId: string): Promise<HttpError | Stock> {
		try {
			const id: number = +stockId;

			const currentStock = await this.stockRepository.getById(+id);

			if (!currentStock) {
				return new HttpError(404, `Stock with this ID: ${id} is not exist`);
			}

			const updatedStock = await this.stockRepository.update(currentStock, dto);
			return updatedStock ?? new HttpError(500, `Failed to update the stock with ${id}`);
		} catch (e) {
			return new HttpError(500, (e as Error).message, 'StockService');
		}
	}

	async delete(stockId: string): Promise<HttpError | null> {
		try {
			const id: number = +stockId;
			const currentPrice = await this.stockRepository.getById(id);

			if (!currentPrice) {
				return new HttpError(404, `Price with this ID: ${id} is not exist`);
			}

			const deletedStock = await this.stockRepository.deletedById(id);
			const isNull = deletedStock === null;
			const errorMessage = new HttpError(500, `Failed to remove the price with ${id}`);

			return isNull ? deletedStock : errorMessage;
		} catch (e) {
			return new HttpError(500, (e as Error).message, 'PriceService');
		}
	}
}
