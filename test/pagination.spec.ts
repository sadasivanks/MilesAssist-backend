import { PaginationDto, SortOrder } from '../src/dto/pagination.dto';

describe('PaginationDto', () => {
  it('has safe defaults', () => {
    const query = new PaginationDto();
    expect(query.page).toBe(1);
    expect(query.limit).toBe(20);
    expect(query.sortOrder).toBe(SortOrder.DESC);
  });
});
