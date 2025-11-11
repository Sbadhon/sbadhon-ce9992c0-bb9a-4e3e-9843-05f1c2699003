import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  IsISO8601,
} from 'class-validator';

export class AuditListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 50;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsISO8601()
  since?: string;
}

export type AuditListQuery = Pick<
  AuditListQueryDto,
  'limit' | 'userId' | 'action' | 'since'
>;
