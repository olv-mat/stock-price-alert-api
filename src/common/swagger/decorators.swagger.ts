import { ApiInternalServerErrorResponse, ApiOperation } from '@nestjs/swagger';

export const SwaggerOperation = (message: string) => {
  return ApiOperation({ summary: message });
};

export const SwaggerInternalServerError = () => {
  return ApiInternalServerErrorResponse({
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  });
};
