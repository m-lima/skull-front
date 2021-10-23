import * as Config from '../model/Config';
import { ISkull, IQuick, IOccurrence } from '../model/Skull';
import { ApiException, UnexpectedResponseException } from '../model/Exception';
import { getLastModified } from './LastModified';

export default class Fetch {
  static async skulls(): Promise<ISkull[]> {
    return Config.Mock.values
      ? new Promise(r => setTimeout(r, 1000)).then(() =>
          JSON.parse(Config.Mock.Data.skulls)
        )
      : fetch(Config.Endpoint.skull, {
          method: 'GET',
          redirect: 'follow',
          credentials: 'include',
          headers: Config.headers,
        })
          .then(r => {
            if (r.ok) {
              return r;
            } else {
              throw new ApiException(r.status);
            }
          })
          .then(r => r.json());
  }

  static async quicks(): Promise<IQuick[]> {
    return Config.Mock.values
      ? new Promise(r => setTimeout(r, 1000)).then(() =>
          JSON.parse(Config.Mock.Data.quicks)
        )
      : fetch(Config.Endpoint.quick, {
          method: 'GET',
          redirect: 'follow',
          credentials: 'include',
          headers: Config.headers,
        })
          .then(r => {
            if (r.ok) {
              return r;
            } else {
              throw new ApiException(r.status);
            }
          })
          .then(r => r.json());
  }

  static async occurrences(): Promise<IOccurrence[]> {
    return Config.Mock.values
      ? Promise.resolve(JSON.parse(Config.Mock.Data.occurrences))
      : fetch(Config.Endpoint.occurrence, {
          method: 'GET',
          redirect: 'follow',
          credentials: 'include',
          headers: Config.headers,
        })
          .then(r => {
            if (r.ok) {
              return r;
            } else {
              throw new ApiException(r.status);
            }
          })
          .then(r => r.json());
  }

  static async lastModified(): Promise<Date> {
    return Config.Mock.values
      ? Promise.resolve(JSON.parse(Config.Mock.Data.lastModified))
      : fetch(Config.Endpoint.occurrence, {
          method: 'HEAD',
          redirect: 'follow',
          credentials: 'include',
          headers: Config.headers,
        }).then(r => {
          if (r.ok) {
            return getLastModified(r);
          } else {
            throw new ApiException(r.status);
          }
        });
  }
}
