import { HttpException, HttpStatus } from '@nestjs/common';

export class GeneralException extends HttpException {
  constructor(message: string, error?: any) {
    super(
      {
        message,
        error: error?.message || error,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
} 