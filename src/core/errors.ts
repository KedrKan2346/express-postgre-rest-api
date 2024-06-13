/**
 * Bad request error which is usually returned when request payload is not valid. HTTP status code 400.
 */
export class BadRequest extends Error {
  constructor(message?: string) {
    super(message || 'Bad Request');
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, BadRequest.prototype);
  }
}

/**
 * Validation error which is usually returned when some conditions are not met in any level of the application code. HTTP status code 400.
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Resource not found. HTTP status code 400.
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
