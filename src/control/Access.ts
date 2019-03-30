import * as Config from "../model/Config"

export default class Access {
  static login() {
    window.location.href = Config.Endpoint.login + '?redirect=' + window.location
  }
}
