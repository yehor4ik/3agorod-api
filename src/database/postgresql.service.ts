import { inject, injectable } from 'inversify';
import { Dialect, Sequelize, DataTypes } from 'sequelize';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IConfigService } from '../config/config.service.interface';
import { Collection } from '../components/controller/collection.model';
import { User } from '../components/users/user.model';
import { Image } from '../components/images/image.model';
import { Price } from '../components/prices/price.model';
import { Stock } from '../components/stocks/stock.model';
import { StockPrices } from '../components/stock-prices/stock-price.model';

@injectable()
export class PostgresqlService {
	client: Sequelize;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IConfigService) private readonly configService: IConfigService,
	) {
		const host = this.configService.get<string>('POSTGRESQL_HOST');
		const port = this.configService.get<number>('POSTGRESQL_PORT');
		const database = this.configService.get<string>('POSTGRESQL_DB');
		const user = this.configService.get<string>('POSTGRESQL_USER');
		const password = this.configService.get<string>('POSTGRESQL_PASSWORD');
		const dialect = this.configService.get<Dialect>('POSTGRESQL_DRIVER');
		this.client = new Sequelize(database, user, password, {
			host,
			port,
			dialect,
			define: {
				timestamps: true,
			},
			logging: false,
		});
		this.initUserModel();
		this.initImageModel();
		this.initCollectionModel();
		this.initPriceModel();
		this.initStockModel();
		this.initStockPricesModel();
	}

	async connect(): Promise<void> {
		try {
			await this.client.sync();
			this.logger.log('[PostgresqlService] Database has been connected');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error('[PostgresqlService] Connected error to database: ' + e.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.close();
	}

	initUserModel(): void {
		User.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					autoIncrement: true,
					primaryKey: true,
				},
				name: {
					type: new DataTypes.STRING(255),
					allowNull: false,
				},
				email: {
					type: new DataTypes.STRING(255),
					allowNull: false,
					unique: true,
				},
				password: {
					type: new DataTypes.STRING(255),
					allowNull: false,
				},
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				underscored: true,
				timestamps: true,
				tableName: 'users',
				sequelize: this.client,
			},
		);
	}

	initCollectionModel(): void {
		Collection.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					autoIncrement: true,
					primaryKey: true,
				},
				name: {
					type: new DataTypes.STRING(255),
					allowNull: false,
				},
				backgroundId: {
					type: new DataTypes.INTEGER(),
					allowNull: false,
				},
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				underscored: true,
				timestamps: true,
				tableName: 'collection',
				sequelize: this.client,
			},
		);
		Collection.belongsTo(Image, { foreignKey: 'backgroundId', as: 'backgroundImage' });
	}

	initImageModel(): void {
		Image.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					autoIncrement: true,
					primaryKey: true,
				},
				url: {
					type: new DataTypes.TEXT(),
					allowNull: false,
				},
				filename: {
					type: new DataTypes.STRING(255),
					allowNull: false,
				},
				size: {
					type: new DataTypes.INTEGER(),
					allowNull: false,
				},
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				underscored: true,
				timestamps: true,
				tableName: 'image',
				sequelize: this.client,
			},
		);
	}

	initPriceModel(): void {
		Price.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					autoIncrement: true,
					primaryKey: true,
				},
				value: {
					type: new DataTypes.FLOAT(),
					allowNull: false,
					defaultValue: 0,
				},
				currency: {
					type: new DataTypes.ENUM('USD', 'EUR', 'UAH'),
					allowNull: false,
					unique: true,
					validate: {
						isIn: [['USD', 'EUR', 'UAH']],
					},
				},
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				underscored: true,
				timestamps: true,
				tableName: 'price',
				sequelize: this.client,
			},
		);
	}

	initStockModel(): void {
		Stock.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					autoIncrement: true,
					primaryKey: true,
				},
				quantity: {
					type: new DataTypes.INTEGER(),
					allowNull: false,
				},
				size: {
					type: new DataTypes.ENUM('XS', 'S', 'M', 'L', 'XL'),
					allowNull: false,
					unique: true,
					validate: {
						isIn: [['XS', 'S', 'M', 'L', 'XL']],
					},
				},
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				underscored: true,
				timestamps: true,
				tableName: 'stock',
				sequelize: this.client,
			},
		);
	}

	initStockPricesModel(): void {
		StockPrices.init(
			{
				stockId: {
					type: new DataTypes.INTEGER(),
					allowNull: false,
					references: {
						model: Stock,
						key: 'id',
					},
				},
				priceId: {
					type: new DataTypes.INTEGER(),
					allowNull: false,
					references: {
						model: Price,
						key: 'id',
					},
				},
			},
			{
				underscored: true,
				tableName: 'stock_prices',
				sequelize: this.client,
				timestamps: false,
			},
		);
		StockPrices.removeAttribute('id');
		Stock.belongsToMany(Price, { through: StockPrices, as: 'prices' });
		Price.belongsToMany(Stock, { through: StockPrices });
	}
}
