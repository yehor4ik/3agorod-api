import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CollectionCreateDto {
	@IsNumber({}, { message: '"backgroundImage" must be a number' })
	@IsNotEmpty({ message: '"backgroundImage" is required' })
	backgroundId: number;
	@IsString({ message: '"name" must be a string' })
	@IsNotEmpty({ message: '"name" is required' })
	name: string;
}
