import { ModelException } from './Exception'

export default class Timestamp {
  date: Date

  constructor(raw: any) {
    if (!raw || raw.millis as string === undefined || raw.millis.length < 0) {
      throw new ModelException('Timestamp', 'millis', raw.millis, 'must be a number greater than zero')
    }

    this.date = new Date(raw.millis)
  }
}

