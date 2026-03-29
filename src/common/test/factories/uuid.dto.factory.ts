import { UuidDto } from 'src/common/dtos/Uuid.dto';

export const makeUuidDto = (ovverride?: Partial<UuidDto>): UuidDto => {
  return Object.assign(new UuidDto(), {
    id: '550e8400-e29b-41d4-a716-446655440000',
    ...ovverride,
  });
};
