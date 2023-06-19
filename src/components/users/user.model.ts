import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

interface IUserCreationAttributes
	extends Omit<InferCreationAttributes<User>, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<InferAttributes<User>, IUserCreationAttributes> {
	public id!: number;
	public name!: string;
	public email!: string;
	public password!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

export { User };
