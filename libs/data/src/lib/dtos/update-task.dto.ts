import { IsDateString, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { TaskCategory } from '../enums/task-category.enum';
import { TaskStatus } from '../enums/task-status.enum';

export class UpdateTaskDto {
  @IsOptional() 
  @IsString()
  @MaxLength(160)
  title?: string;

  @IsOptional() 
  @IsString() 
  @MaxLength(1000)
  description?: string;

  @IsOptional() 
  @IsEnum(TaskCategory)
  category?: TaskCategory;

  @IsOptional() 
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsDateString() 
  dueDate?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
