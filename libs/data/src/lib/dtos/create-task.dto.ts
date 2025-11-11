import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskCategory } from '../enums/task-category.enum';

export class CreateTaskDto {
  @IsString() @MaxLength(160)
  title!: string;

  @IsOptional() 
  @IsString() 
  @MaxLength(1000)
  description?: string;

  @IsOptional() 
  @IsEnum(TaskCategory)
  category?: TaskCategory;

  @IsOptional()
  @IsDateString() 
  dueDate?: string | null;
}
