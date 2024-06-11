export class BadRequest extends Error {
  constructor(message?: string) {
    super(message || 'Bad Request');
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, BadRequest.prototype);
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
