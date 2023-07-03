import { Product } from './product.model';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';

export interface IProductService {
	create: (dto: ProductCreateDto) => Promise<Product>;
	getAll: () => Promise<Product[]>;
	update: (dto: ProductUpdateDto, stockId: string) => Promise<Product>;
	// delete: (productId: string) => Promise<null>;
}
