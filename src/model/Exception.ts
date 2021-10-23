import HTTPStatusCode from './HTTPStatusCode';
import Status from './Status';

export class ApiException {
  httpStatus: number;
  status: Status;

  constructor(status: number) {
    this.httpStatus = status;
    switch (status) {
      case HTTPStatusCode.UNAUTHORIZED:
        this.status = Status.UNAUTHORIZED;
        break;
      case HTTPStatusCode.FORBIDDEN:
        this.status = Status.FORBIDDEN;
        break;
      default:
        this.status = Status.ERROR;
    }
  }
}

export class ModelException<T> {
  model: string;
  field: string;
  value: T;
  message: string;

  constructor(model: string, field: string, value: T, message: string) {
    this.model = model;
    this.field = field;
    this.value = value;
    this.message = message;
  }

  toString() {
    return `Invalid ${this.field} (${this.value}) for ${this.model}: ${this.message}`;
  }
}

export class UnexpectedResponseException {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  toString() {
    return this.message;
  }
}

export class IllegalStateException {
  toString() {
    return 'The state is out of sync';
  }
}
