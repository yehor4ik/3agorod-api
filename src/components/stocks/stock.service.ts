import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { HttpError } from '../../errors/http-error.class';
import { IStockService } from './stock.service.interface';
import { StockCreateDto } from './dto/stock-create.dto';
import { StockUpdateDto } from './dto/stock-update.dto';
import { Stock } from './stock.model';
import { IStockRepository } from './stock.repository.interface';
import { IStockPriceRepository } from '../stock-price/stock-price.repository.interface';
import { IPriceRepository } from '../prices/price.repository.interface';
import { StockPrice } from '../stock-price/stock-price.model';
import { ICreateStockResponse } from './types/create-stock-response.interface';

@injectable()
export class StockService implements IStockService {
	constructor(
		@inject(TYPES.StockRepository) private readonly stockRepository: IStockRepository,
		@inject(TYPES.PriceRepository) private readonly priceRepository: IPriceRepository,
		@inject(TYPES.StockPriceRepository)
		private readonly stockPriceRepository: IStockPriceRepository,
	) {}
	async create(dto: StockCreateDto): Promise<ICreateStockResponse> {
		const { prices, ...restDto } = dto;

		const createdStock = await this.stockRepository.create(restDto);
		const createdPrice = await this.priceRepository.createManyPrices(prices);

		if (!createdStock || !createdPrice) {
			throw new HttpError(500, 'Stock has been not created', 'StockService');
		}

		const stockPriceDbQuery = createdPrice.map((price) => ({
			stockId: createdStock.id,
			priceId: price.id,
		})) as StockPrice[];

		await this.stockPriceRepository.create(stockPriceDbQuery);
		return { ...createdStock.dataValues, prices: createdPrice };
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
