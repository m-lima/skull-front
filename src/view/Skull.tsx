import React, { Component } from 'react'
import './css/Skull.css'

import * as Message from './Message'
import Access from '../control/Access'
import Confirmation from './Confirmation'
import Fetch from '../control/Fetch'
import Footer from './Footer'
import Grid from './Grid'
import ISkullValue, { IQuickValue } from '../model/ISkullValue'
import Push from '../control/Push'
import Status from '../model/Status'
import { ApiException } from "../model/Exception"

const dummySkullValue: ISkullValue = {
  type: '',
  amount: 0,
}

interface IState {
  skullValues: IQuickValue[]
  status: Status
  selected: ISkullValue
  showConfirmation: boolean
}

export default class Skull extends Component<{}, IState> {
  state = {
    skullValues: [],
    status: Status.LOADING,
    selected: dummySkullValue,
    showConfirmation: false,
  }

  componentDidMount() {
    Fetch.quickValues()
      .then(q => this.setState({ skullValues: q, status: (q.length > 0 ? Status.OK : Status.EMPTY) }))
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

  confirmValue(value: ISkullValue) {
    this.setState({ showConfirmation: true, selected: { type: value.type, amount: value.amount } })
  }

  update(value: string | number) {
    if (typeof value === "string") {
      this.state.selected.type = value
      this.setState({ selected: this.state.selected })
    } else {
      this.state.selected.amount = value
      this.setState({ selected: this.state.selected })
    }
  }

  accept() {
    this.setState({ status: Status.LOADING, showConfirmation: false })
    Push.skullValue(this.state.selected)
      .then(() => this.setState({  status: Status.OK }))
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

  cancel() {
    this.setState({ showConfirmation: false })
  }

  render() {
    switch (this.state.status) {
      case Status.LOADING:
        return <Message.Loading />
      case Status.OK:
      case Status.EMPTY:
        return (
          <div className='Skull'>
            <Grid skullValues={this.state.skullValues} confirmAction={this.confirmValue.bind(this)} />
            <Footer />
            {
              this.state.showConfirmation && <Confirmation
                skullValues={this.state.skullValues}
                selected={this.state.selected}
                onUpdate={this.update.bind(this)}
                onAccept={this.accept.bind(this)}
                onCancel={this.cancel.bind(this)}
              />
            }
          </div>
        )
      case Status.UNAUTHORIZED:
        return <Message.Unauthorized />
      default:
        return <Message.Error />
    }
  }
}
