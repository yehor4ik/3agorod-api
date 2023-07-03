import { InferAttributes, Model } from 'sequelize';

export class ProductImages extends Model<InferAttributes<ProductImages>, ProductImages> {
	public productId!: number;
	public imageId!: number;
}
