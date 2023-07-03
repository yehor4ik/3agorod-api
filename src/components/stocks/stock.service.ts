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
	async create(dto: StockCreateDto): Promise<Stock> {
		const transaction = await this.postgresqlService.client.transaction();

		try {
			const { prices: pricesDto, ...stockDto } = dto;

			const stock = await this.stockRepository.create(stockDto, { transaction });
			const prices = await this.priceRepository.createManyPrices(pricesDto, { transaction });

			const query = prices.map((price) => ({ stockId: stock.id, priceId: price.id }));
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
		const transaction = await this.postgresqlService.client.transaction();
		const { prices: pricesDto, ...stockDto } = dto;
		try {
			const currentStock = await this.stockRepository.getById(+id, { transaction });

			if (!currentStock) {
				throw new HttpError(404, `Stock by this ID: ${id} is not found`, 'StockService');
			}

			const updatedStock = await this.stockRepository.update(currentStock, stockDto, {
				transaction,
			});

			if (!updatedStock.prices) {
				throw new HttpError(500, `Server Error`, 'StockService');
			}

			await Promise.all(
				updatedStock.prices.map((price, idx) =>
					this.priceRepository.updatePriceById(price.id, pricesDto[idx], { transaction }),
				),
			);
			await transaction.commit();

			const stockResult = await this.stockRepository.getById(+id);

			return stockResult as Stock;
		} catch (e) {
			await transaction.rollback();

			if (e instanceof HttpError) {
				throw new HttpError(e.statusCode, e.message, e.context);
			}

			throw new HttpError(500, (e as Error).message, 'StockService');
		}
	}

	async delete(stockId: string): Promise<null> {
		const id: number = +stockId;
		const transaction = await this.postgresqlService.client.transaction();
		try {
			const currentStock = await this.stockRepository.getById(id, { transaction });

			if (!currentStock) {
				throw new HttpError(404, `Stock with this ID: ${id} is not exist`, 'StockService');
			}

			await this.stockRepository.deletedById(id, { transaction });

			await Promise.all(
				(currentStock.prices ?? []).map(({ id }) =>
					this.priceRepository.deletedPriceById(id, { transaction }),
				),
			);

			await this.stockPriceRepository.deleteByStockId(id, { transaction });

			await transaction.commit();
			return null;
		} catch (e) {
			await transaction.rollback();

			if (e instanceof HttpError) {
				throw new HttpError(e.statusCode, e.message, e.context);
			}

			throw new HttpError(500, (e as Error).message, 'StockService');
		}
	}
}
