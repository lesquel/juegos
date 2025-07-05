import type {
  ErrorResponse,
  ErrorResponseErrorsArray,
} from "@models/ErrorResponse";

export class ErrorResponseAdapter {
  static adaptErrorResponse(error: any): ErrorResponse | undefined {
    if (!error.response) return;
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
