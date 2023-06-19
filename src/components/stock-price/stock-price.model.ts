import { InferAttributes, Model } from 'sequelize';

export class StockPrice extends Model<InferAttributes<StockPrice>, StockPrice> {
	public stockId!: number;
	public priceId!: number;
}
