import {
	ArrayMinSize,
	ArrayNotEmpty,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	ValidateNested,
} from 'class-validator';
import { SizeTypes } from '../stock.model';
import { Type } from 'class-transformer';
import { PriceCreateDto } from '../../prices/dto/price-create.dto';

export class StockUpdateDto {
	@IsNumber()
	@IsNotEmpty({ message: '"quantity" is required' })
	@IsOptional()
	quantity: number;

	@IsEnum(SizeTypes)
	@IsNotEmpty({ message: '"size" is required' })
	@IsOptional()
	size: SizeTypes;

	@ArrayNotEmpty()
	@ArrayMinSize(1)
	@ValidateNested({ message: 'hello' })
	@Type(() => PriceCreateDto)
	@IsOptional()
	prices: PriceCreateDto[];
}
