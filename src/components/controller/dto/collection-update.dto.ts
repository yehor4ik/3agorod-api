import { IsOptional } from 'class-validator';

export class CollectionUpdateDto {
	@IsOptional()
	backgroundId: number;
	@IsOptional()
	name: string;
}
