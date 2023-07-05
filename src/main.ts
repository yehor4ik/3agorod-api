import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { UserController } from './components/users/user.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { Container, ContainerModule, interfaces } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IUserController } from './components/users/user.controller.interface';
import { IUserService } from './components/users/users.service.interface';
import { UsersService } from './components/users/users.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PostgresqlService } from './database/postgresql.service';
import { IUsersRepository } from './components/users/users.repository.interface';
import { UsersRepository } from './components/users/users.repository';
import { ICollectionController } from './components/controller/collection.controller.interface';
import { CollectionController } from './components/controller/collection.controller';
import { ICollectionService } from './components/controller/collection.service.interface';
import { CollectionService } from './components/controller/collection.service';
import { ICollectionRepository } from './components/controller/collection.repository.interface';
import { CollectionRepository } from './components/controller/collection.repository';
import { IImageController } from './components/images/image.controller.interface';
import { ImageController } from './components/images/image.controller';
import { IImageService } from './components/images/image.service.interface';
import { ImageService } from './components/images/image.service';
import { IImageRepository } from './components/images/image.repository.interface';
import { ImageRepository } from './components/images/image.repository';
import { IPriceController } from './components/prices/price.controller.interface';
import { PriceController } from './components/prices/price.controller';
import { IPriceService } from './components/prices/price.service.interface';
import { PriceService } from './components/prices/price.service';
import { IPriceRepository } from './components/prices/price.repository.interface';
import { PriceRepository } from './components/prices/price.repository';
import { IStockController } from './components/stocks/stock.controller.interface';
import { StockController } from './components/stocks/stock.controller';
import { IStockService } from './components/stocks/stock.service.interface';
import { StockService } from './components/stocks/stock.service';
import { IStockRepository } from './components/stocks/stock.repository.interface';
import { StockRepository } from './components/stocks/stock.repository';
import { IStockPriceRepository } from './components/stock-prices/stock-price.repository.interface';
import { StockPriceRepository } from './components/stock-prices/stock-price.repository';
import { IProductStocksRepository } from './components/product-stocks/product-stocks.repository.interface';
import { ProductStocksRepository } from './components/product-stocks/product-stocks.repository';
import { IProductImagesRepository } from './components/product-images/product-images.repository.interface';
import { ProductImagesRepository } from './components/product-images/product-images.repository';
import { IProductRepository } from './components/product/product.repository.interface';
import { ProductRepository } from './components/product/product.repository';
import { IProductService } from './components/product/product.service.interface';
import { ProductService } from './components/product/product.service';
import { IProductController } from './components/product/product.controller.interface';
import { ProductController } from './components/product/product.controller';
import { CronService } from './cron/cron.service';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter);
	bind<IUserController>(TYPES.IUserController).to(UserController);
	bind<IUserService>(TYPES.IUserService).to(UsersService);
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<PostgresqlService>(TYPES.PostgresqlService).to(PostgresqlService).inSingletonScope();
	bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository).inSingletonScope();
	bind<ICollectionController>(TYPES.CollectionController).to(CollectionController);
	bind<ICollectionService>(TYPES.CollectionService).to(CollectionService);
	bind<ICollectionRepository>(TYPES.CollectionRepository).to(CollectionRepository);
	bind<IImageController>(TYPES.ImageController).to(ImageController);
	bind<IImageService>(TYPES.ImageService).to(ImageService);
	bind<IImageRepository>(TYPES.ImageRepository).to(ImageRepository);
	bind<IPriceController>(TYPES.PriceController).to(PriceController);
	bind<IPriceService>(TYPES.PriceService).to(PriceService);
	bind<IPriceRepository>(TYPES.PriceRepository).to(PriceRepository);
	bind<IStockController>(TYPES.StockController).to(StockController);
	bind<IStockService>(TYPES.StockService).to(StockService);
	bind<IStockRepository>(TYPES.StockRepository).to(StockRepository);
	bind<IStockPriceRepository>(TYPES.StockPriceRepository).to(StockPriceRepository);
	bind<IProductStocksRepository>(TYPES.ProductStocksRepository).to(ProductStocksRepository);
	bind<IProductImagesRepository>(TYPES.ProductImagesRepository).to(ProductImagesRepository);
	bind<IProductRepository>(TYPES.ProductRepository).to(ProductRepository);
	bind<IProductService>(TYPES.ProductService).to(ProductService);
	bind<IProductController>(TYPES.ProductController).to(ProductController);
	bind<CronService>(TYPES.CronService).to(CronService);
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
