import * as Config from '../model/Config'
import { Skull, RawValuedSkull as RawQuick, RawOccurrence} from '../model/Skull'
import { ApiException } from '../model/Exception'

const mapToSkull = (raw: any): Skull => {
  return new Skull(raw)
}

const mapToQuick = (raw: any): RawQuick => {
  return new RawQuick(raw)
}

const mapToOccurrence = (raw: any): RawOccurrence => {
  return new RawOccurrence(raw)
}

export default class Fetch {
  static skulls(): Promise<Skull[]> {
    let data = Config.Mock.values
      ? new Promise(r => setTimeout(r, 1000)).then(() => JSON.parse(Config.Mock.Data.skulls))
      : fetch(Config.Endpoint.skull, {
        method: 'GET',
        redirect: 'follow',
        credentials: 'include',
      })
        .then(r => {
          if (r.ok) {
            return r
          } else {
            throw new ApiException(r.status)
          }
        })
        .then(r => r.json())

    return data.then(v => v.map(mapToSkull).filter((v: Skull) => v))
  }

  static quicks(): Promise<RawQuick[]> {
    let data = Config.Mock.values
      ? new Promise(r => setTimeout(r, 1000)).then(() =>(JSON.parse(Config.Mock.Data.quicks)))
      : fetch(Config.Endpoint.quick, {
        method: 'GET',
        redirect: 'follow',
        credentials: 'include',
      })
        .then(r => {
          if (r.ok) {
            return r
          } else {
            throw new ApiException(r.status)
          }
        })
        .then(r => r.json())

    return data.then(v => v.map(mapToQuick).filter((v: RawQuick) => v))
  }

  static occurrences(): Promise<RawOccurrence[]> {
    let data = Config.Mock.values
      ? Promise.resolve(JSON.parse(Config.Mock.Data.occurrences))
      : fetch(Config.Endpoint.occurrence, {
        method: 'GET',
        redirect: 'follow',
        credentials: 'include',
      })
        .then(r => {
          if (r.ok) {
            return r
          } else {
            throw new ApiException(r.status)
          }
        })
        .then(r => r.json())

    return data.then(v => v.map(mapToOccurrence).filter((v: RawOccurrence) => v))
  }
}
