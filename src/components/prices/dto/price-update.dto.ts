import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CurrencyTypes } from '../price.model';

export class PriceUpdateDto {
	@IsOptional()
	@IsNumber()
	value: number;

	@IsEnum(CurrencyTypes)
	@IsOptional()
	currency: CurrencyTypes;
}
