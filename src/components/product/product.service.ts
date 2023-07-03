import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { HttpError } from '../../errors/http-error.class';
import { StockPrices } from '../stock-prices/stock-price.model';
import { PostgresqlService } from '../../database/postgresql.service';
import { IProductService } from './product.service.interface';
import { IImageRepository } from '../images/image.repository.interface';
import {
	IProductImagesRepository,
	IUpdateImageIdQuery,
} from '../product-images/product-images.repository.interface';
import { IProductStocksRepository } from '../product-stocks/product-stocks.repository.interface';
import { ProductCreateDto } from './dto/product-create.dto';
import { Product } from './product.model';
import { IStockRepository } from '../stocks/stock.repository.interface';
import { IProductRepository } from './product.repository.interface';
import { IPriceRepository } from '../prices/price.repository.interface';
import { IStockPriceRepository } from '../stock-prices/stock-price.repository.interface';
import { ProductStocks } from '../product-stocks/product-srocks.model';
import { ProductImages } from '../product-images/product-images.model';
import { ProductUpdateDto } from './dto/product-update.dto';

@injectable()
export class ProductService implements IProductService {
	constructor(
		@inject(TYPES.ProductRepository) private readonly productRepository: IProductRepository,
		@inject(TYPES.StockRepository)
		private readonly stockRepository: IStockRepository,
		@inject(TYPES.PriceRepository) private readonly priceRepository: IPriceRepository,
		@inject(TYPES.ImageRepository) private readonly imageRepository: IImageRepository,
		@inject(TYPES.ProductImagesRepository)
		private readonly productImagesRepository: IProductImagesRepository,
		@inject(TYPES.ProductStocksRepository)
		private readonly productStocksRepository: IProductStocksRepository,
		@inject(TYPES.StockPriceRepository)
		private readonly stockPricesRepository: IStockPriceRepository,
		@inject(TYPES.PostgresqlService) private readonly postgresqlService: PostgresqlService,
	) {}
	async create(dto: ProductCreateDto): Promise<any> {
		const transaction = await this.postgresqlService.client.transaction();

		try {
			const { stocks: stocksDto, images: imagesIds, ...productDto } = dto;

			const product = await this.productRepository.create(productDto, { transaction });

			const stockIds = await Promise.all(
				stocksDto.map(async (stock) => {
					const { prices: pricesDto, ...stockItemDto } = stock;
					const stockItem = await this.stockRepository.create(stockItemDto, { transaction });
					const prices = await this.priceRepository.createManyPrices(pricesDto, {
						transaction,
					});

					const query = prices.map((price) => ({ stockId: stockItem.id, priceId: price.id }));
					await this.stockPricesRepository.create(query as StockPrices[], { transaction });

					return stockItem.id;
				}),
			);
			const productStocksQuery = stockIds.map((stockId) => ({ productId: product.id, stockId }));

			await this.productStocksRepository.create(productStocksQuery as ProductStocks[], {
				transaction,
			});

			const productImagesQuery = imagesIds.map((imageId) => ({ productId: product.id, imageId }));

			await this.productImagesRepository.create(productImagesQuery as ProductImages[], {
				transaction,
			});

			await transaction.commit();

			const result = await this.productRepository.getById(product.id);
			if (!result) {
				throw new HttpError(
					404,
					`Product by this ID: ${product.id} is not found`,
					'ProductService',
				);
			}

			return result;
		} catch (e) {
			await transaction.rollback();

			if (e instanceof HttpError) {
				throw new HttpError(e.statusCode, e.message, e.context);
			}

			throw new HttpError(500, (e as Error).message, 'ProductService');
		}
	}

	async getAll(): Promise<Product[]> {
		return await this.productRepository.getAll();
	}
	async update(dto: ProductUpdateDto, productId: string): Promise<Product> {
		const id: number = +productId;
		const transaction = await this.postgresqlService.client.transaction();
		const { stocks: stocksDto, images: imagesIds, ...productDto } = dto;
		try {
			const currentProduct = await this.productRepository.getById(id, { transaction });

			if (!currentProduct) {
				throw new HttpError(404, `Product by this ID: ${id} is not found`, 'ProductService');
			}

			const updatedProduct = await this.productRepository.update(currentProduct, productDto, {
				transaction,
			});

			if (!updatedProduct.stocks) {
				throw new HttpError(500, `Server Error`, 'ProductService');
			}

			await Promise.all(
				updatedProduct.stocks.map(async (stock, idx) => {
					const oldStock = await this.stockRepository.getById(stock.id);
					const { prices: pricesDto, ...restStockDto } = stocksDto[idx];

					if (!oldStock) {
						throw new HttpError(
							404,
							`Stocks by this ID: ${stock.id} is not found`,
							'ProductService',
						);
					}
					const newStock = await this.stockRepository.update(oldStock, restStockDto, {
						transaction,
					});
					await Promise.all(
						(newStock?.prices ?? []).map((price, priceIdx) =>
							this.priceRepository.updatePriceById(price.id, pricesDto[priceIdx], {
								transaction,
							}),
						),
					);
				}),
			);

			await Promise.all(
				(updatedProduct?.images ?? []).map((imageId, idx) => {
					const query: IUpdateImageIdQuery = {
						productId: currentProduct.id,
						imageId: imageId.id,
						newImageId: imagesIds[idx],
					};
					return this.productImagesRepository.updateImageId(query, { transaction });
				}),
			);

			await transaction.commit();

			return (await this.productRepository.getById(id)) as Product;
		} catch (e) {
			await transaction.rollback();

			if (e instanceof HttpError) {
				throw new HttpError(e.statusCode, e.message, e.context);
			}

			throw new HttpError(500, (e as Error).message, 'StockService');
		}
	}

	//
	// async delete(stockId: string): Promise<null> {
	// 	const id: number = +stockId;
	// 	const transaction = await this.postgresqlService.client.transaction();
	// 	try {
	// 		const currentStock = await this.stockRepository.getById(id, { transaction });
	//
	// 		if (!currentStock) {
	// 			throw new HttpError(404, `Stock with this ID: ${id} is not exist`, 'StockService');
	// 		}
	//
	// 		await this.stockRepository.deletedById(id, { transaction });
	//
	// 		await Promise.all(
	// 			(currentStock.prices ?? []).map(({ id }) =>
	// 				this.priceRepository.deletedPriceById(id, { transaction }),
	// 			),
	// 		);
	//
	// 		await this.stockPriceRepository.deleteByStockId(id, { transaction });
	//
	// 		await transaction.commit();
	// 		return null;
	// 	} catch (e) {
	// 		await transaction.rollback();
	//
	// 		if (e instanceof HttpError) {
	// 			throw new HttpError(e.statusCode, e.message, e.context);
	// 		}
	//
	// 		throw new HttpError(500, (e as Error).message, 'StockService');
	// 	}
	// }
}
