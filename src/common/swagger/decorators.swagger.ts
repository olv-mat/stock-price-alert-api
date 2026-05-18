import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const SwaggerOperation = (message: string) => {
  return ApiOperation({ summary: message });
};

export const SwaggerBearerAuth = () => {
  return ApiBearerAuth();
};

export const SwaggerCustomResponse = (schema: object) => {
  return ApiOkResponse({
    schema: schema,
  });
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

export const SwaggerUnauthorized = (message: string) => {
  return ApiUnauthorizedResponse({
    schema: {
      example: {
        message: message,
        error: 'Unauthorized',
        statusCode: 401,
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
