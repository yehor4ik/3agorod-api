import { inject, injectable } from 'inversify';
import { Dialect, Sequelize, DataTypes } from 'sequelize';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { INITIALIZATION_POSTGRESQL_DB } from './constants';
import { IConfigService } from '../config/config.service.interface';
import { Collection } from '../collections/collection.entity';

@injectable()
export class PostgresqlService {
	client: Sequelize;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IConfigService) private readonly configService: IConfigService,
	) {
		const host = this.configService.get<string>('POSTGRESQL_HOST') || 'postgresql';
		const port = this.configService.get<number>('POSTGRESQL_PORT') || 5432;
		const database = this.configService.get<string>('POSTGRESQL_DB') || 'shop_db';
		const user = this.configService.get<string>('POSTGRESQL_USER') || 'admin';
		const password = this.configService.get<string>('POSTGRESQL_PASSWORD') || 'mypassword!!';
		const dialect = this.configService.get<Dialect>('POSTGRESQL_DRIVER') || 'postgres';
		this.client = new Sequelize(database, user, password, {
			host,
			port,
			dialect,
			define: {
				timestamps: true,
			},
		});
		this.initCollectionModel();
	}

	async connect(): Promise<void> {
		try {
			await this.client.authenticate();
			await this.client.query(INITIALIZATION_POSTGRESQL_DB);
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

	initCollectionModel(): void {
		Collection.init(
			{
				id: {
					type: DataTypes.INTEGER.UNSIGNED,
					autoIncrement: true,
					primaryKey: true,
				},
				name: {
					type: new DataTypes.STRING(128),
					allowNull: false,
				},
				backgroundImage: {
					type: new DataTypes.TEXT(),
					allowNull: true,
				},
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				underscored: true,
				timestamps: true,
				tableName: 'collection',
				sequelize: this.client, // passing the `sequelize` instance is required
			},
		);
	}
}
