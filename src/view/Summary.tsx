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
    this.renderRow = this.renderRow.bind(this)
  }

  componentDidMount() {
    this.setState({ skullValues: [], status: Status.LOADING, selected: undefined })
    Promise.all([Fetch.registeredValues(), Fetch.quickValues()])
      .then(r => this.setState({
        skullValues: r[0],
        status: (r[0].length > 0 ? Status.OK : Status.EMPTY),
        icons: r[1].reduce((m, v) => {
          m.set(v.type, v.icon)
          return m
        }, new Map<string, string>()),
        selected: undefined,
      }))
      .catch(ex => {
        if (ex instanceof ApiException) {
          if (ex.status == Status.UNAUTHORIZED) {
            Access.login()
            return
          }
          console.error('HTTP error status: ' + ex.httpStatus)
          this.setState({ skullValues: [], status: ex.status, icons: new Map<string, string>(), selected: undefined })
        } else {
          console.error(ex)
          this.setState({ skullValues: [], status: Status.ERROR , icons: new Map<string, string>(), selected: undefined })
        }
      })
  }

  renderRow(value: IRegisteredValue, index: number) {
    return (
      <tr key={index}>
        <td>
          {this.state.icons.has(value.type) && <Icon icon={this.state.icons.get(value.type) as string} />}
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
            {this.state.selected && <Confirmation
              types={this.state.skullValues.map(v => v.type)}
              value={this.state.selected as IRegisteredValue}
              onAccept={() => Push.deletion(this.state.selected as IRegisteredValue)}
              onCancel={() => this.setState({ selected: undefined })}
            />}
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

