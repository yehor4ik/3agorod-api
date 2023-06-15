import { injectable } from 'inversify';
import { IStockRepository } from './stock.repository.interface';
import { StockCreateDto } from './dto/stock-create.dto';
import { Stock } from './stock.model';
import { StockUpdateDto } from './dto/stock-update.dto';

@injectable()
export class StockRepository implements IStockRepository {
	async create(dto: StockCreateDto): Promise<Stock | null> {
		const newStock = await Stock.create(dto);
		return newStock ?? null;
	}
	async getById(stockId: number): Promise<Stock | null> {
		const stock = await Stock.findOne({
			where: { id: stockId },
		});

		return stock ?? null;
	}

	async getAll(): Promise<Stock[]> {
		const stocks = await Stock.findAll();
		return stocks ?? [];
	}

	async update(currentStock: Stock, dto: StockUpdateDto): Promise<Stock | null> {
		const updatedStock = currentStock.update(dto);

		return updatedStock ?? null;
	}

	async deletedById(stockId: number): Promise<null> {
		await Stock.destroy({ where: { id: stockId } });

		return null;
	}
}
