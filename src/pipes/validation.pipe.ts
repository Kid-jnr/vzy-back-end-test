import { ValidationPipe as NextValidationPipe } from '@nestjs/common';

export class ValidationPipe extends NextValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
      stopAtFirstError: false,
    });
  }
}
