import React, { Component } from 'react'
import './css/Skull.css'

import * as Config from '../model/Config'
import * as Message from './Message'
import Access from '../control/Access'
import Confirmation from './Confirmation'
import Environment from '../model/Environment'
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

const Banner = (props: { text: string }) => {
  return (
    <div className='Banner-text'>
      {props.text}
    </div>
  )
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

  constructor(props: {}) {
    super(props)
    this.update = this.update.bind(this)
    this.accept = this.accept.bind(this)
    this.cancel = this.cancel.bind(this)
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

  renderMain() {
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
                onUpdate={this.update}
                onAccept={this.accept}
                onCancel={this.cancel}
              />
            }
          </div>
        )
      case Status.FORBIDDEN:
        return <Message.Unauthorized />
      default:
        return <Message.Error />
    }
  }

  render() {
    if (Config.environment == Environment.DEVELOPMENT) {
      return (
        <div className='Banner-overlay'>
          <Banner text='Development' />
          {this.renderMain()}
        </div>
      )
    }

    return this.renderMain()
  }
}
