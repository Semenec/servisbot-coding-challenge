import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaginationQueryDto } from '../pagination-query.dto';

function build(raw: Record<string, unknown>): PaginationQueryDto {
  return plainToInstance(PaginationQueryDto, raw);
}

describe('PaginationQueryDto', () => {
  describe('resolve', () => {
    it('uses defaults when page and pageSize are omitted', () => {
      expect(build({}).resolve()).toEqual({ take: 20, skip: 0 });
    });

    it('computes skip from page and pageSize', () => {
      expect(build({ page: 3, pageSize: 25 }).resolve()).toEqual({
        take: 25,
        skip: 50,
      });
    });

    it('coerces numeric strings (transport sends strings)', () => {
      const dto = build({ page: '2', pageSize: '10' });
      expect(dto.resolve()).toEqual({ take: 10, skip: 10 });
    });

    it('throws BadRequestException when offset exceeds the cap', () => {
      const dto = build({ page: 1001, pageSize: 100 });
      expect(() => dto.resolve()).toThrow(BadRequestException);
    });
  });
});
