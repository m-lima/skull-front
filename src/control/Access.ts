import * as Config from "../model/Config.dev"

export default class Access {
  static login() {
    window.location.href = Config.Endpoint.login + '?redirect=' + window.location
  }
}
