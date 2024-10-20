export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    console.error(`[${error.name}] ${error.message}`);
    return { error: error.message, statusCode: error.statusCode };
  } else if (error instanceof Error) {
    console.error(`[UnhandledError] ${error.message}`);
    return { error: 'An unexpected error occurred', statusCode: 500 };
  } else {
    console.error('[UnknownError]', error);
    return { error: 'An unknown error occurred', statusCode: 500 };
  }
}
