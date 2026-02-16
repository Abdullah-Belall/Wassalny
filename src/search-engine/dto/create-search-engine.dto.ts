import { IsIn, IsJSON, IsOptional, IsString } from 'class-validator';

export const SEARCH_ENGINE_ENTITIES = [
  'travels',
  'cars',
  'reviews',
  'users',
  'travels_passengers',
  'images',
] as const;

export type SearchEngineEntity = (typeof SEARCH_ENGINE_ENTITIES)[number];

export class CreateSearchEngineDto {
  @IsString()
  @IsIn(SEARCH_ENGINE_ENTITIES)
  entity: string;
  @IsJSON()
  query: string;
  @IsJSON()
  @IsOptional()
  add_select: string;
  @IsString()
  @IsOptional()
  order_by_column?: string;
  @IsIn(['DESC', 'ASC'])
  @IsOptional()
  order_by_order?: 'DESC' | 'ASC';
}
