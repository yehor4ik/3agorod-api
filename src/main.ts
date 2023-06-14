import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/user.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { Container, ContainerModule, interfaces } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IUserController } from './users/user.controller.interface';
import { IUserService } from './users/users.service.interface';
import { UsersService } from './users/users.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PostgresqlService } from './database/postgresql.service';
import { IUsersRepository } from './users/users.repository.interface';
import { UsersRepository } from './users/users.repository';
import { ICollectionController } from './collections/collection.controller.interface';
import { CollectionController } from './collections/collection.controller';
import { ICollectionService } from './collections/collection.service.interface';
import { CollectionService } from './collections/collection.service';
import { ICollectionRepository } from './collections/collection.repository.interface';
import { CollectionRepository } from './collections/collection.repository';
import { IImageController } from './images/image.controller.interface';
import { ImageController } from './images/image.controller';
import { IImageService } from './images/image.service.interface';
import { ImageService } from './images/image.service';
import { IImageRepository } from './images/image.repository.interface';
import { ImageRepository } from './images/image.repository';
import { IPriceController } from './prices/price.controller.interface';
import { PriceController } from './prices/price.controller';
import { IPriceService } from './prices/price.service.interface';
import { PriceService } from './prices/price.service';
import { IPriceRepository } from './prices/price.repository.interface';
import { PriceRepository } from './prices/price.repository';

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
