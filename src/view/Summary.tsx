import React, { Component, Fragment } from 'react'
import './css/Summary.css'

import * as Message from './Message'
import Access from '../control/Access'
import Confirmation from './Confirmation'
import Fetch from '../control/Fetch'
import IQueryState from '../model/IQueryState'
import Icon from './Icon'
import Status from '../model/Status'
import { ApiException } from '../model/Exception'
import { IRegisteredValue } from '../model/ISkullValue'
import Push from '../control/Push'

interface IState extends IQueryState {
  skullValues: IRegisteredValue[]
  icons: Map<string, string>
  selected?: IRegisteredValue
}

export default class Summary extends Component<{}, IState> {

  constructor(props: {}) {
    super(props)
    this.handleException = this.handleException.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.accept = this.accept.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  handleException(ex: any) {
    if (ex instanceof ApiException) {
      if (ex.status == Status.UNAUTHORIZED) {
        Access.login()
        return
      }
      console.error('HTTP error status: ' + ex.httpStatus)
      this.setState({ skullValues: [], status: ex.status, icons: new Map<string, string>(), selected: undefined })
    } else {
      console.error(ex)
      this.setState({ skullValues: [], status: Status.ERROR, icons: new Map<string, string>(), selected: undefined })
    }
  }

  componentDidMount() {
    this.setState({ skullValues: [], status: Status.LOADING, selected: undefined })
    Promise.all([Fetch.registeredValues(), Fetch.quickValues()])
      .then(r => this.setState({
        skullValues: r[0],
        status: (r[0].length > 0 ? Status.OK : Status.EMPTY),
        icons: r[1].reduce((m, v) => {
          m.set(v.type + v.amount, v.icon)
          return m
        }, new Map<string, string>()),
        selected: undefined,
      }))
      .catch(this.handleException)
  }

  accept() {
    this.setState({ status: Status.LOADING })
    Push.deletion(this.state.selected as IRegisteredValue)
      .then(() => this.setState({ status: Status.OK, selected: undefined }))
      .catch(this.handleException)
  }

  cancel() {
    this.setState({ selected: undefined })
  }

  renderRow(value: IRegisteredValue, index: number) {
    return (
      <tr key={index}>
        <td>
          {this.state.icons.has(value.type + value.amount) && <Icon icon={this.state.icons.get(value.type + value.amount) as string} />}
        </td>
        <td>{value.type}</td>
        <td>{value.amount}</td>
        <td>{new Date(value.millis).toLocaleString()}</td>
        <td id='delete' onClick={() => this.setState({ selected: value })}>
          <Icon icon='fas fa-trash-alt' />
        </td>
      </tr>
    )
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
          <Fragment>
            <table className='Summary'>
              <tbody>
                <tr>
                  <th id='icon'></th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Time</th>
                  <th id='icon'></th>
                </tr>
                {this.state.skullValues.map(this.renderRow)}
              </tbody>
            </table>
            <Confirmation
              types={this.state.skullValues.map(v => v.type)}
              value={this.state.selected}
              onAccept={this.accept}
              onCancel={this.cancel}
            />
          </Fragment>
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

