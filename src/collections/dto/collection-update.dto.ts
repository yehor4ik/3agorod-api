import { IsOptional } from 'class-validator';

export class CollectionUpdateDto {
	@IsOptional()
	backgroundImage: string;
	@IsOptional()
	name: string;
}
