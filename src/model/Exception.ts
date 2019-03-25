export class NotOkException {
  status: number

  constructor(status: number) {
    this.status = status
  }
}