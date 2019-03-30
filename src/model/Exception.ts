import FetchStatus from "./FetchStatus"
import HTTPStatusCode from "./HTTPStatusCode"

export class FetchException {
  httpStatus: number
  status: FetchStatus

  constructor(status: number) {
    this.httpStatus = status
    switch (status) {
      case HTTPStatusCode.UNAUTHORIZED:
        this.status = FetchStatus.UNAUTHORIZED
        break
      case HTTPStatusCode.FORBIDDEN:
        this.status = FetchStatus.FORBIDDEN
        break
      default:
        this.status = FetchStatus.ERROR
    }
  }
}