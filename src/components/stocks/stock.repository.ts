import { injectable } from 'inversify';
import { IStockRepository } from './stock.repository.interface';
import { IStockCreationAttributes, Stock } from './stock.model';
import { StockUpdateDto } from './dto/stock-update.dto';
import { HttpError } from '../../errors/http-error.class';
import { Error } from 'sequelize';
import { Price } from '../prices/price.model';
import {
	Attributes,
	CreateOptions,
	DestroyOptions,
	FindOptions,
	InstanceUpdateOptions,
} from 'sequelize/types/model';

@injectable()
export class StockRepository implements IStockRepository {
	async create(
		dto: IStockCreationAttributes,
		options?: CreateOptions<Attributes<Stock>>,
	): Promise<Stock> {
		const currentOptions: CreateOptions<Attributes<Stock>> = {
			...options,
		};
		try {
			const newStock = await Stock.create(dto, currentOptions);
			return newStock ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockRepository.create');
		}
	}
	async getById(stockId: number, options?: FindOptions<Attributes<Stock>>): Promise<Stock | null> {
		const currentOption: FindOptions<Attributes<Stock>> = {
			where: { id: stockId },
			include: {
				model: Price,
				through: { attributes: [] },
				as: 'prices',
			},
			...(options ?? {}),
		};

		try {
			const stock = await Stock.findOne(currentOption);

			return stock ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockRepository.getById');
		}
	}

	async getAll(): Promise<Stock[]> {
		try {
			const stocks = await Stock.findAll({
				include: {
					model: Price,
					through: { attributes: [] },
					as: 'prices',
				},
			});
			return stocks ?? [];
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockRepository.getAll');
		}
	}

	async update(
		currentStock: Stock,
		dto: Omit<StockUpdateDto, 'prices'>,
		options?: InstanceUpdateOptions<IStockCreationAttributes>,
	): Promise<Stock> {
		try {
			const currentOptions = {
				include: {
					model: Price,
					through: { attributes: [] },
					as: 'prices',
				},
				returning: true,
				...(options ?? {}),
			};

			return currentStock.update(dto, currentOptions);
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockRepository.update');
		}
	}

	async deletedById(stockId: number, options?: DestroyOptions<Attributes<Stock>>): Promise<null> {
		try {
			const currentOptions = {
				where: { id: stockId },
				...(options ?? {}),
			};
			await Stock.destroy(currentOptions);

			return null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'StockRepository');
		}
	}
}
