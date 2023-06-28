import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { HttpError } from '../../errors/http-error.class';
import { IStockService } from './stock.service.interface';
import { StockCreateDto } from './dto/stock-create.dto';
import { StockUpdateDto } from './dto/stock-update.dto';
import { Stock } from './stock.model';
import { IStockRepository } from './stock.repository.interface';
import { IStockPriceRepository } from '../stock-prices/stock-price.repository.interface';
import { IPriceRepository } from '../prices/price.repository.interface';
import { StockPrices } from '../stock-prices/stock-price.model';
import { PostgresqlService } from '../../database/postgresql.service';

@injectable()
export class StockService implements IStockService {
	constructor(
		@inject(TYPES.StockRepository) private readonly stockRepository: IStockRepository,
		@inject(TYPES.PriceRepository) private readonly priceRepository: IPriceRepository,
		@inject(TYPES.StockPriceRepository)
		private readonly stockPriceRepository: IStockPriceRepository,
		@inject(TYPES.PostgresqlService) private readonly postgresqlService: PostgresqlService,
	) {}
	async create(dto: StockCreateDto): Promise<any> {
		const transaction = await this.postgresqlService.client.transaction();

		try {
			const { prices, ...restDto } = dto;

			const stock = await this.stockRepository.create(restDto, { transaction });
			const pricesResult = await this.priceRepository.createManyPrices(prices, { transaction });

			const query = pricesResult.map((price) => ({ stockId: stock.id, priceId: price.id }));
			await this.stockPriceRepository.create(query as StockPrices[], { transaction });

			await transaction.commit();

			const result = await this.stockRepository.getById(stock.id);
			if (!result) {
				throw new HttpError(404, `Stock by this ID: ${stock.id} is not found`, 'StockService');
			}

			return result;
		} catch (e) {
			await transaction.rollback();

			if (e instanceof HttpError) {
				throw new HttpError(e.statusCode, e.message, e.context);
			}

			throw new HttpError(500, (e as Error).message, 'StockService');
		}
	}

	async getAll(): Promise<Stock[]> {
		return await this.stockRepository.getAll();
	}

	async update(dto: StockUpdateDto, stockId: string): Promise<Stock> {
		const id: number = +stockId;

		const currentStock = await this.stockRepository.getById(+id);

		if (!currentStock) {
			throw new HttpError(404, `Stock with this ID: ${id} is not exist`, 'StockService');
		}

		const updatedStock = await this.stockRepository.update(currentStock, dto);

		if (!updatedStock) {
			throw new HttpError(500, `Stock with this ID: ${id} is not updated`, 'StockService');
		}

		return updatedStock;
	}

	async delete(stockId: string): Promise<null> {
		const id: number = +stockId;
		const currentPrice = await this.stockRepository.getById(id);

		if (!currentPrice) {
			throw new HttpError(404, `Price with this ID: ${id} is not exist`, 'StockService');
		}

		return await this.stockRepository.deletedById(id);
	}
}
