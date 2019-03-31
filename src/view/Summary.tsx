import React, { Component } from 'react'
import './css/Summary.css'

import * as Message from './Message'
import Access from '../control/Access'
import Fetch from '../control/Fetch'
import Status from '../model/Status'
import { ApiException } from '../model/Exception'
import { IRegisteredValue } from '../model/ISkullValue'

interface IState {
  skullValues: IRegisteredValue[]
  status: Status
}

export default class Summary extends Component<{}, IState> {

  componentDidMount() {
    this.setState({ skullValues: [], status: Status.LOADING })
    Fetch.registeredValues()
      .then(r => this.setState({ skullValues: r, status: (r.length > 0 ? Status.OK : Status.EMPTY) }))
      .catch(ex => {
        if (ex instanceof ApiException) {
          if (ex.status == Status.UNAUTHORIZED) {
            Access.login()
            return
          }
          console.error('HTTP error status: ' + ex.httpStatus)
          this.setState({ skullValues: [], status: ex.status })
        } else {
          console.error(ex)
          this.setState({ skullValues: [], status: Status.ERROR })
        }
      })
  }

  render() {
    if (!this.state) {
      return <Message.Loading />
    }

    switch (this.state.status) {
      case Status.LOADING:
        return <Message.Loading />
      case Status.OK:
        return (
          <table>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Time</th>
            </tr>
            {this.state.skullValues.map((v, i) =>
                                        <tr key={i}>
                                          <td>{v.type}</td>
                                          <td>{v.amount}</td>
                                          <td>{new Date(v.millis).toUTCString()}</td>
                                        </tr>
                                       )}
                                     </table>
      )
      case Status.EMPTY:
        return <Message.Empty />
      case Status.FORBIDDEN:
        return <Message.Unauthorized />
      case Status.ERROR:
        return <Message.Error />
    }

  }
}

