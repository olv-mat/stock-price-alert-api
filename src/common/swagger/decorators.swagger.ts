import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const SwaggerOperation = (message: string) => {
  return ApiOperation({ summary: message });
};

export const SwaggerBadRequest = (message: string) => {
  return ApiBadRequestResponse({
    schema: {
      example: {
        message: message,
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  });
};

export const SwaggerNotFound = (message: string) => {
  return ApiNotFoundResponse({
    schema: {
      example: {
        message: message,
        error: 'Not Found',
        statusCode: 404,
      },
    },
  });
};

export const SwaggerConflict = (message: string) => {
  return ApiConflictResponse({
    schema: {
      example: {
        message: message,
        error: 'Conflict',
        statusCode: 409,
      },
    },
  });
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
