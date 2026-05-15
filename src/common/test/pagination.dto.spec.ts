import { validate } from 'class-validator';
import 'reflect-metadata';
import { makePaginationDto } from './factories/pagination.dto.factory';

describe('PaginationDto', () => {
  it('should accept when is valid', async () => {
    const dto = makePaginationDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('page', () => {
    it('should fail if is not an integer number', async () => {
      const dto = makePaginationDto({ page: 1.1 });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('page');
      expect(error.constraints).toHaveProperty('isInt');
    });

    it('should fail if is lower than 1', async () => {
      const dto = makePaginationDto({ page: -1 });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('page');
      expect(error.constraints).toHaveProperty('min');
    });
  });

  describe('limit', () => {
    it('should fail if is not an integer number', async () => {
      const dto = makePaginationDto({ limit: 10.1 });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('limit');
      expect(error.constraints).toHaveProperty('isInt');
    });

    it('should fail if is lower than 1', async () => {
      const dto = makePaginationDto({ limit: 0 });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('limit');
      expect(error.constraints).toHaveProperty('min');
    });

    it('should fail if is greater than 100', async () => {
      const dto = makePaginationDto({ limit: 101 });
      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      const error = errors[0];
      expect(error.property).toBe('limit');
      expect(error.constraints).toHaveProperty('max');
    });
  });
});
