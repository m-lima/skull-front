import * as Config from '../model/Config';
import {
  Skull,
  ProtoOccurrence,
  Occurrence,
  IOccurrence,
} from '../model/Skull';
import {
  ApiException,
  UnexpectedResponseException,
  OutOfSyncException,
} from '../model/Exception';
import { getLastModified } from './LastModified';

export default class Push {
  static async create(
    occurrence: ProtoOccurrence,
    skull: Skull
  ): Promise<IOccurrence> {
    const payload = {
      skull: skull.id,
      amount: occurrence.amount,
      millis: occurrence.millis,
    };

    if (Config.Mock.values) {
      return Promise.resolve({
        id: Math.floor(Math.random() * 100),
        ...payload,
      });
    }

    return fetch(Config.Endpoint.occurrence, {
      method: 'POST',
      redirect: 'follow',
      credentials: 'include',
      headers: Config.headers,
      body: JSON.stringify(payload),
    })
      .then(r => {
        if (r.ok) {
          return r.text();
        } else if (r.status === 412) {
          throw new OutOfSyncException();
        } else {
          throw new ApiException(r.status);
        }
      })
      .then(id => {
        const idValue = Number(id);
        if (!idValue) {
          throw new UnexpectedResponseException('Id returned is not a number');
        }
        return {
          id: idValue,
          ...payload,
        };
      });
  }

  static async update(
    occurrence: Occurrence,
    skull: Skull,
    unmodifiedSince: Date
  ): Promise<Date> {
    if (Config.Mock.values) {
      return Promise.resolve(new Date());
    }

    return fetch(`${Config.Endpoint.occurrence}/${occurrence.id}`, {
      method: 'PUT',
      redirect: 'follow',
      credentials: 'include',
      headers: [
        ['if-unmodified-since', String(unmodifiedSince.getTime())],
        ...Config.headers,
      ],
      body: JSON.stringify({
        skull: skull.id,
        amount: occurrence.amount,
        millis: occurrence.millis,
      }),
    }).then(r => {
      if (r.ok) {
        return getLastModified(r);
      } else if (r.status === 412) {
        throw new OutOfSyncException();
      } else {
        throw new ApiException(r.status);
      }
    });
  }

  static async deletion(
    occurrence: Occurrence,
    unmodifiedSince: Date
  ): Promise<Date> {
    if (Config.Mock.values) {
      return Promise.resolve(new Date());
    }

    return fetch(`${Config.Endpoint.occurrence}/${occurrence.id}`, {
      method: 'DELETE',
      redirect: 'follow',
      credentials: 'include',
      headers: [
        ['if-unmodified-since', String(unmodifiedSince.getTime())],
        ...Config.headers,
      ],
    }).then(r => {
      if (r.ok) {
        return getLastModified(r);
      } else if (r.status === 412) {
        throw new OutOfSyncException();
      } else {
        throw new ApiException(r.status);
      }
    });
  }
}
