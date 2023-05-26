import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('[ConfigService] The .env file could not be read or is missed');
		} else {
			this.logger.log('[ConfigService] .env has benn loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}
	get<T extends string | number>(key: string): T {
		const envValue = this.config[key];
		if (isNaN(+envValue)) {
			return envValue as T;
		}

		return +envValue as T;
	}
}
