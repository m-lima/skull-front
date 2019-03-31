import React, { Component, Fragment } from 'react'
import './css/Grid.css'
import './css/Confirmation.css'

import * as Message from './Message'
import Access from '../control/Access'
import Confirmation from './Confirmation'
import Fetch from '../control/Fetch'
import IQueryState from '../model/IQueryState'
import ISkullValue, { IQuickValue } from '../model/ISkullValue'
import Icon from './Icon'
import Push from '../control/Push'
import Status from '../model/Status'
import { ApiException } from '../model/Exception'

interface IState extends IQueryState {
  skullValues: IQuickValue[]
  showConfirmation: boolean
}

export default class Grid extends Component<{}, IState> {
  confirmationBox: React.RefObject<Confirmation>

  constructor(props: {}) {
    super(props)
    this.accept = this.accept.bind(this)
    this.cancel = this.cancel.bind(this)
    this.confirmationBox = React.createRef()
  }

  componentDidMount() {
    this.setState({ skullValues: [], status: Status.LOADING, showConfirmation: false  })
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

  showConfirmation(skullValue: ISkullValue) {
    (this.confirmationBox.current as Confirmation).setState({ selected: { type: skullValue.type, amount: skullValue.amount } })
    this.setState({ showConfirmation: true })
  }

  accept(skullValue: ISkullValue) {
    console.log(skullValue.type, skullValue.amount)
    this.setState({ status: Status.LOADING, showConfirmation: false })
    Push.skullValue(skullValue)
      .then(() => this.setState({  status: Status.OK }))
      .catch(ex => {
        if (ex instanceof ApiException) {
          if (ex.status == Status.UNAUTHORIZED) {
            Access.login()
            return
          }
          console.error('HTTP error status: ' + ex.httpStatus)
          this.setState({ skullValues: [], status: ex.status, showConfirmation: false })
        } else {
          console.error(ex)
          this.setState({ skullValues: [], status: Status.ERROR, showConfirmation: false })
        }
      })
  }

  cancel() {
    this.setState({ showConfirmation: false })
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
            {/* {this.state.showConfirmation && <Confirmation ref={this.confirmationBox} types={this.state.skullValues.map(v => v.type)} onAccept={this.accept} onCancel={this.cancel} />} */}
            <Confirmation
              ref={this.confirmationBox}
              visible={this.state.showConfirmation}
              types={this.state.skullValues.map(v => v.type)}
              onAccept={this.accept}
              onCancel={this.cancel}
            />
            {/* {this.state.showConfirmation && <Confirmation display={this.state.showConfirmation} skullValues={this.state.skullValues} selected={this.state.selected} onAccept={this.accept} onCancel={this.cancel} onUpdate={this.update} />} */}
            {/* <Confirmation display={this.state.showConfirmation} skullValues={this.state.skullValues} onAccept={this.accept} onCancel={this.cancel} /> */}
          </Fragment>
      )
      case Status.FORBIDDEN:
        return <Message.Unauthorized />
      case Status.ERROR:
        return <Message.Error />
    }
  }
}
