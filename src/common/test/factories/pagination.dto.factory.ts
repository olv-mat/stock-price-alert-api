import { PaginationDto } from 'src/common/dtos/pagination.dto';

export const makePaginationDto = (
  override?: Partial<PaginationDto>,
): PaginationDto => {
  return Object.assign(new PaginationDto(), {
    ...override,
  });
};
