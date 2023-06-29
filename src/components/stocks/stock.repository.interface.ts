import { IStockCreationAttributes, Stock } from './stock.model';
import { StockUpdateDto } from './dto/stock-update.dto';
import {
	Attributes,
	CreateOptions,
	FindOptions,
	InstanceUpdateOptions,
} from 'sequelize/types/model';

export interface IStockRepository {
	create: (
		dto: IStockCreationAttributes,
		options: CreateOptions<Attributes<Stock>>,
	) => Promise<Stock>;
	getById: (stockId: number, options?: FindOptions<Attributes<Stock>>) => Promise<Stock | null>;
	getAll: () => Promise<Stock[]>;
	update: (
		currentStock: Stock,
		dto: Omit<StockUpdateDto, 'prices'>,
		options?: InstanceUpdateOptions<IStockCreationAttributes>,
	) => Promise<Stock>;
	deletedById: (stockId: number) => Promise<null>;
}
