import React, { Component, Fragment } from 'react'
import './css/Grid.css'
import './css/Confirmation.css'

import * as Message from './Message'
import Access from '../control/Access'
import Fetch from '../control/Fetch'
import IQueryState from '../model/IQueryState'
import ISkullValue, { IQuickValue } from '../model/ISkullValue'
import Icon from './Icon'
import Push from '../control/Push'
import RichConfirmation from './RichConfirmation'
import Status from '../model/Status'
import { ApiException } from '../model/Exception'

interface IState extends IQueryState {
  skullValues: IQuickValue[]
  selected?: ISkullValue
}

export default class Grid extends Component<{}, IState> {

  constructor(props: {}) {
    super(props)
    this.handleException = this.handleException.bind(this)
    this.change = this.change.bind(this)
    this.accept = this.accept.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  handleException(ex: any) {
    if (ex instanceof ApiException) {
      if (ex.status === Status.UNAUTHORIZED) {
        Access.login()
        return
      }
      console.error('HTTP error status: ' + ex.httpStatus)
      this.setState({ skullValues: [], status: ex.status, selected: undefined })
    } else {
      console.error(ex)
      this.setState({ skullValues: [], status: Status.ERROR, selected: undefined })
    }
  }

  componentDidMount() {
    this.setState({ skullValues: [], status: Status.LOADING, selected: undefined  })
    Fetch.quickValues()
      .then(q => this.setState({ skullValues: q, status: (q.length > 0 ? Status.OK : Status.EMPTY) }))
      .catch(this.handleException)
  }

  showConfirmation(skullValue: ISkullValue) {
    this.setState({ selected: { type: skullValue.type, amount: skullValue.amount } })
  }

  change(value: ISkullValue) {
    this.setState({ selected: value })
  }

  accept() {
    const selected = this.state.selected!
    this.setState({ status: Status.LOADING, selected: undefined })
    Push.skullValue(selected)
      .then(() => this.setState({  status: Status.OK }))
      .catch(this.handleException)
  }

  cancel() {
    this.setState({ selected: undefined })
  }

  buildSkullButton(skullValue: IQuickValue, index?: number) {
    return (
      <div
        key={index}
        className='Grid-button'
        title={skullValue.type + ': ' + skullValue.amount}
        onClick={e => this.showConfirmation(skullValue)}
      >
        <Icon icon={skullValue.icon} />
      </div>
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
      case Status.EMPTY:
        return (
          <Fragment>
            <div className='Grid' >
              {this.state.skullValues && this.state.skullValues.map((q, i) => this.buildSkullButton(q, i))}
            </div>
            <RichConfirmation
              types={this.state.skullValues.map(v => v.type)}
              value={this.state.selected}
              onChange={this.change}
              onAccept={this.accept}
              onCancel={this.cancel}
            />
          </Fragment>
      )
      case Status.FORBIDDEN:
        return <Message.Unauthorized />
      case Status.ERROR:
        return <Message.Error />
    }
  }
}
