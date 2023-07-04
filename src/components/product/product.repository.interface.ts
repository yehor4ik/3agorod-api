import {
	Attributes,
	CreateOptions,
	DestroyOptions,
	FindOptions,
	InstanceUpdateOptions,
} from 'sequelize/types/model';
import { IProductCreationAttributes, Product } from './product.model';

export interface IProductRepository {
	create: (
		dto: IProductCreationAttributes,
		options?: CreateOptions<Attributes<Product>>,
	) => Promise<Product>;
	getById: (
		productId: number,
		options?: FindOptions<Attributes<Product>>,
	) => Promise<Product | null>;
	getAll: () => Promise<Product[]>;
	update: (
		currentProduct: Product,
		dto: IProductCreationAttributes,
		options?: InstanceUpdateOptions<IProductCreationAttributes>,
	) => Promise<Product>;
	deletedById: (stockId: number, options?: DestroyOptions<Attributes<Product>>) => Promise<null>;
}
