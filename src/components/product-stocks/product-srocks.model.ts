import { InferAttributes, Model } from 'sequelize';

export class ProductStocks extends Model<InferAttributes<ProductStocks>, ProductStocks> {
	public productId!: number;
	public stockId!: number;
}
