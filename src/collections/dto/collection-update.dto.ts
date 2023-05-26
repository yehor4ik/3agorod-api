import { IsOptional } from 'class-validator';

export class CollectionUpdateDto {
	@IsOptional()
	background_image: string;
	@IsOptional()
	name: string;
}
