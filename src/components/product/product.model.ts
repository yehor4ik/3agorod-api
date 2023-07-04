import { Association, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Stock } from '../stocks/stock.model';
import { Image } from '../images/image.model';

export interface IProductCreationAttributes
	extends Omit<InferCreationAttributes<Product>, 'id' | 'createdAt' | 'updatedAt'> {}

export class Product extends Model<InferAttributes<Product>, IProductCreationAttributes> {
	public id!: number;
	public name!: string;
	public description!: string;
	public collectionId!: number;

	public readonly stocks?: Stock[];
	public readonly images?: Image[];
	public static associations: {
		stocks: Association<Product, Stock>;
		images: Association<Product, Image>;
	};

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}
