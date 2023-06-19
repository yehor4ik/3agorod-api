import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SizeTypes } from '../stock.model';

export class StockUpdateDto {
	@IsOptional()
	@IsNumber()
	quantity: number;

	@IsEnum(SizeTypes)
	@IsOptional()
	size: SizeTypes;
}
