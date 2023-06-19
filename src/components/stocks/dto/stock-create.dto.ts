import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	ArrayNotEmpty,
	ValidateNested,
	ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SizeTypes } from '../stock.model';
import { PriceCreateDto } from '../../prices/dto/price-create.dto';

export class StockCreateDto {
	@IsNumber()
	@IsNotEmpty({ message: '"quantity" is required' })
	quantity: number;

	@IsEnum(SizeTypes)
	@IsNotEmpty({ message: '"size" is required' })
	size: SizeTypes;

	@ArrayNotEmpty()
	@ArrayMinSize(1)
	@ValidateNested({ message: 'hello' })
	@Type(() => PriceCreateDto)
	prices: PriceCreateDto[];
}
