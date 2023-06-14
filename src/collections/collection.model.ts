import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface CollectionCreationAttributes
	extends Omit<InferCreationAttributes<Collection>, 'id' | 'createdAt' | 'updatedAt'> {}
class Collection extends Model<InferAttributes<Collection>, CollectionCreationAttributes> {
	public id!: number;
	public name!: string;
	public backgroundId: number;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

export { Collection };
