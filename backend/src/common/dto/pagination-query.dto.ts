import { BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MAX_OFFSET = 10_000;

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  pageSize?: number;

  resolve(): { take: number; skip: number } {
    const page = this.page ?? DEFAULT_PAGE;
    const take = this.pageSize ?? DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * take;
    if (skip > MAX_OFFSET) {
      throw new BadRequestException(
        `Pagination depth exceeded (max offset ${MAX_OFFSET}). Refine your query instead of paging deeper.`,
      );
    }
    return { take, skip };
  }
}
