import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface IStockCreationAttributes
	extends Omit<InferCreationAttributes<Stock>, 'id' | 'createdAt' | 'updatedAt'> {}

export enum SizeTypes {
	XS = 'XS',
	S = 'S',
	M = 'M',
	L = 'L',
	XL = 'XL',
}
export class Stock extends Model<InferAttributes<Stock>, IStockCreationAttributes> {
	public id!: number;
	public quantity!: number;
	public size!: SizeTypes;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}
