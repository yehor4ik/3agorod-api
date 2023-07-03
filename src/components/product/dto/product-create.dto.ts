import {
	IsNotEmpty,
	IsNumber,
	ArrayNotEmpty,
	ValidateNested,
	ArrayMinSize,
	IsString,
	Length,
	ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StockCreateDto } from '../../stocks/dto/stock-create.dto';

export class ProductCreateDto {
	@IsString()
	@Length(1, 255, { message: '"name" should be from 1 to 255 symbols' })
	@IsNotEmpty({ message: '"name" is required' })
	name: string;

	@IsString()
	@IsNotEmpty({ message: '"description" is required' })
	description: string;

	@IsNumber()
	@IsNotEmpty({ message: '"collectionId" is required' })
	collectionId: number;

	@ArrayNotEmpty()
	@ArrayMinSize(1)
	@ValidateNested()
	@Type(() => StockCreateDto)
	stocks: StockCreateDto[];

	@IsNumber({}, { each: true })
	@ArrayNotEmpty()
	@ArrayMinSize(1)
	@ArrayMaxSize(5)
	images: number[];
}
