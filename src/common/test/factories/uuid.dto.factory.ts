import { UuidDto } from 'src/common/dtos/uuid.dto';

export const makeUuidDto = (ovverride?: Partial<UuidDto>): UuidDto => {
  return Object.assign(new UuidDto(), {
    id: 'f3b8c2d4-9e6a-4f71-a8c9-2d5b7e3c1a90',
    ...ovverride,
  });
};
