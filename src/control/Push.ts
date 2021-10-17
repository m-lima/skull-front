import * as Config from '../model/Config'
import { ProtoOccurrence, Occurrence } from '../model/Skull'
import { ApiException, UnexpectedResponseException } from '../model/Exception'

export default class Push {
  static async skull(occurrence: ProtoOccurrence): Promise<number> {
    if (Config.Mock.values) {
      return Promise.resolve(Math.floor(Math.random() * 100))
    }

    return fetch(Config.Endpoint.occurrence, {
      method: 'POST',
      redirect: 'follow',
      credentials: 'include',
      headers: Config.headers,
      body: JSON.stringify({
        skull: occurrence.skull.id,
        amount: occurrence.amount,
        millis: occurrence.millis,
      }),
    })
      .then(r => {
        if (r.ok) {
          const idHeader = r.headers.get('location')
          if (!idHeader) {
            throw new UnexpectedResponseException('Location header not present')
          } else {
            const id = Number(idHeader!)
            if (!id) {
              throw new UnexpectedResponseException('Location header value is not a number')
            }
            return id
          }
        } else {
          throw new ApiException(r.status)
        }
      })
  }

  static async update(occurrence: Occurrence): Promise<boolean> {
    if (Config.Mock.values) {
      return Promise.resolve(true)
    }

    return fetch(`${Config.Endpoint.occurrence}/${occurrence.id}`, {
      method: 'PUT',
      redirect: 'follow',
      credentials: 'include',
      headers: Config.headers,
      body: JSON.stringify({
        skull: occurrence.skull.id,
        amount: occurrence.amount,
        millis: occurrence.millis,
      }),
    })
      .then(r => {
        if (r.ok) {
          return true
        } else {
          throw new ApiException(r.status)
        }
      })
  }

  static async deletion(occurrence: Occurrence): Promise<boolean> {
    if (Config.Mock.values) {
      return Promise.resolve(true)
    }

    return fetch(`${Config.Endpoint.occurrence}/${occurrence.id}`, {
      method: 'DELETE',
      redirect: 'follow',
      credentials: 'include',
      headers: Config.headers,
    })
      .then(r => {
        if (r.ok) {
          return true
        } else {
          throw new ApiException(r.status)
        }
      })
  }
}
