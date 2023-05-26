import { IsString, IsNotEmpty } from 'class-validator';

export class CollectionCreateDto {
	@IsString({ message: '"background_image" must be a string' })
	@IsNotEmpty({ message: '"background_image" is required' })
	background_image: string;
	@IsString({ message: '"name" must be a string' })
	@IsNotEmpty({ message: '"name" is required' })
	name: string;
}
