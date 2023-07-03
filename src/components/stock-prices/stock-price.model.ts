import { InferAttributes, Model } from 'sequelize';

export class StockPrices extends Model<InferAttributes<StockPrices>, StockPrices> {
	public stockId!: number;
	public priceId!: number;
}
