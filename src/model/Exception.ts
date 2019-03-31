import HTTPStatusCode from "./HTTPStatusCode"
import Status from "./Status"

export class ApiException {
  httpStatus: number
  status: Status

  constructor(status: number) {
    this.httpStatus = status
    switch (status) {
      case HTTPStatusCode.UNAUTHORIZED:
        this.status = Status.UNAUTHORIZED
        break
      case HTTPStatusCode.FORBIDDEN:
        this.status = Status.FORBIDDEN
        break
      default:
        this.status = Status.ERROR
    }
  }
}