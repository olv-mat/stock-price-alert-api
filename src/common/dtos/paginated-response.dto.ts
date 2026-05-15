type PaginatedResponseProperties = {
  data: object[];
  total: number;
  page: number;
  limit: number;
};

type PaginationMetaProperties = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
};

export class PaginatedResponseDto {
  public readonly data: object[];
  public readonly meta: PaginationMetaProperties;

  private constructor(properties: PaginatedResponseProperties) {
    this.data = properties.data;
    this.meta = {
      totalItems: properties.total,
      totalPages: Math.ceil(properties.total / properties.limit),
      currentPage: properties.page,
      itemsPerPage: properties.limit,
    };
  }

  public static create(
    properties: PaginatedResponseProperties,
  ): PaginatedResponseDto {
    return new PaginatedResponseDto({
      data: properties.data,
      total: properties.total,
      page: properties.page,
      limit: properties.limit,
    });
  }
}
