import * as Config from '../model/Config';
import { ISkull, IQuick, IOccurrence } from '../model/Skull';
import Timestamp from '../model/Timestamp';
import { ApiException } from '../model/Exception';

const mapToTimestamp = (raw: any): Timestamp => {
  return new Timestamp(raw);
};

export default class Fetch {
  static async skulls(): Promise<ISkull[]> {
    let data = Config.Mock.values
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

    return data;
  }

  static async quicks(): Promise<IQuick[]> {
    let data = Config.Mock.values
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

    return data;
  }

  static async occurrences(): Promise<IOccurrence[]> {
    let data = Config.Mock.values
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

    return data;
  }

  static async lastModified(): Promise<Timestamp> {
    let data = Config.Mock.values
      ? Promise.resolve(JSON.parse(Config.Mock.Data.lastModified))
      : fetch(Config.Endpoint.lastModified, {
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

    return data.then(mapToTimestamp);
  }
}
