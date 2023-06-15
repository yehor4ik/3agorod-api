import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { SizeTypes } from '../stock.model';

export class StockCreateDto {
	@IsNumber()
	@IsNotEmpty({ message: '"quantity" is required' })
	quantity: number;

	@IsEnum(SizeTypes)
	@IsNotEmpty({ message: '"size" is required' })
	size: SizeTypes;
}
