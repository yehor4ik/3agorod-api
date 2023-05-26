import { inject, injectable } from 'inversify';
import { Client } from 'pg';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { INITIALIZATION_POSTGRESQL_DB } from './constants';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class PostgresqlService {
	client: Client;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IConfigService) private readonly configService: IConfigService,
	) {
		this.client = new Client({
			host: this.configService.get<string>('POSTGRESQL_HOST') || 'postgresql',
			port: this.configService.get<number>('POSTGRESQL_PORT') || 5432,
			database: this.configService.get<string>('POSTGRESQL_DB') || 'shop_db',
			user: this.configService.get<string>('POSTGRESQL_USER') || 'admin',
			password: this.configService.get<string>('POSTGRESQL_PASSWORD') || 'mypassword!!',
		});
	}

	async connect(): Promise<void> {
		try {
			await this.client.connect();
			await this.client.query(INITIALIZATION_POSTGRESQL_DB);
			this.logger.log('[PostgresqlService] Database has been connected');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error('[PostgresqlService] Connected error to database: ' + e.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.end();
	}
}
