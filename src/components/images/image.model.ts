import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export interface IImageImageCreationAttributes
	extends Omit<InferCreationAttributes<Image>, 'id' | 'createdAt' | 'updatedAt'> {}
export class Image extends Model<InferAttributes<Image>, IImageImageCreationAttributes> {
	public id!: number;
	public url!: string;
	public filename!: string;
	public size!: number;
	public mimetype!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}
