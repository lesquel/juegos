export interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
  code: number;
}


export interface ErrorResponseErrorsArray {
  errors: string[];
  code: number;
}
