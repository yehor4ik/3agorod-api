import {
	IsNotEmpty,
	IsNumber,
	ArrayNotEmpty,
	ValidateNested,
	ArrayMinSize,
	IsString,
	Length,
	ArrayMaxSize,
	IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StockCreateDto } from '../../stocks/dto/stock-create.dto';

export class ProductUpdateDto {
	@IsOptional()
	@IsString()
	@Length(1, 255, { message: '"name" should be from 1 to 255 symbols' })
	@IsNotEmpty({ message: '"name" is required' })
	name: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty({ message: '"description" is required' })
	description: string;

	@IsOptional()
	@IsNumber()
	@IsNotEmpty({ message: '"collectionId" is required' })
	collectionId: number;

	@IsOptional()
	@ArrayNotEmpty()
	@ArrayMinSize(1)
	@ValidateNested()
	@Type(() => StockCreateDto)
	stocks: StockCreateDto[];

	@IsOptional()
	@IsNumber({}, { each: true })
	@ArrayNotEmpty()
	@ArrayMinSize(1)
	@ArrayMaxSize(5)
	images: number[];
}
