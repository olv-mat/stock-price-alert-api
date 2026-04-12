import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AtLeastOneFieldPipe implements PipeTransform {
  public transform(value: object): void {
    if (!value || Object.keys(value).length === 0) {
      throw new BadRequestException('At least one field must be provided');
    }
  }
}
