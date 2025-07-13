import type {
  ErrorResponse,
  ErrorResponseErrorsArray,
} from "@models/errorResponse";

export class ErrorResponseAdapter {
  static adaptErrorResponse(error: any): ErrorResponse | undefined {
    if (!error.response) {
      if (!error.name) return undefined;
      return {
        errors: {
          [error.name]: [error.message],
        },
        code: error.code,
      };
    };
    return {
      errors: error.response.data.errors,
      code: error.response.status,
    };
  }

  static adaptErrorResponseErrorsArray(
    error: ErrorResponse | undefined
  ): ErrorResponseErrorsArray | undefined {
    if (!error) return undefined;
    return {
      errors: Object.values(error.errors).flat(),
      code: error.code,
    };
  }
}
