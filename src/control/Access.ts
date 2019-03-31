import * as Config from '../model/Config'

export default class Access {
  static login() {
    window.location.href = Config.Endpoint.login + '?redirect=' + window.location
  }

  static logout() {
    window.location.href = Config.Endpoint.logout + '?redirect=' + window.location
  }
}
