import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CurrencyTypes } from '../price.model';

export class PriceCreateDto {
	@IsNumber()
	@IsNotEmpty()
	value: number;

	@IsEnum(CurrencyTypes)
	currency: CurrencyTypes;
}
