import Config from "../Config"
import QuickValue from "../model/QuickValue"
import { NotOkException } from "../model/Exception"

export default class Fetch {
  static readonly mockQuickValues: QuickValue[] = [
    {
      type: 'bla',
      icon: 'fas fa-beer',
      amount: 1,
    },
    {
      type: 'ble',
      icon: 'fas fa-beer',
      amount: 1.5,
    },
    {
      type: 'bli',
      icon: 'fas fa-beer',
      amount: 0.5,
    },
    {
      type: 'blo',
      icon: 'fas fa-beer',
      amount: 0,
    },
    {
      type: 'blu',
      icon: 'fas fa-beer',
      amount: 2,
    },
  ]

  static quickValues(): Promise<QuickValue[]> {
    if (Config.mockQuickValues) {
      return Promise.resolve(Fetch.mockQuickValues)
    }

    return fetch('https://api.mflima.com/skull/quick', {
      method: 'GET',
      redirect: "follow",
      credentials: 'include',
    })
      .then(r => {
        if (r.ok) {
          return r
        } else {
          throw new NotOkException(r.status)
        }
      })
      .then(r => r.json())
  }
}