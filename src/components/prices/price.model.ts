import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface PriceCreationAttributes
	extends Omit<InferCreationAttributes<Price>, 'id' | 'createdAt' | 'updatedAt'> {}

export enum CurrencyTypes {
	USD = 'USD',
	EUR = 'EUR',
	UAH = 'UAH',
}
export class Price extends Model<InferAttributes<Price>, PriceCreationAttributes> {
	public id!: number;
	public value!: number;
	public currency!: CurrencyTypes;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}
