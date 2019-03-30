import React, { Component } from 'react'
import './css/Skull.css'

import * as Exception from '../model/Exception'
import * as Message from './Message'
import Access from '../control/Access'
import Confirmation from './Confirmation'
import Fetch from '../control/Fetch'
import FetchStatus from '../model/FetchStatus'
import Footer from './Footer'
import ISkullValue from '../model/ISkullValue'
import Grid from './Grid'

interface IState {
  skullValues: ISkullValue[]
  status: FetchStatus
  selected?: ISkullValue
}

class Skull extends Component<{}, IState> {
  state = {
    skullValues: [],
    status: FetchStatus.LOADING,
    selected: undefined,
  }

  componentDidMount() {
    Fetch.quickValues()
      .then(q => this.setState({ skullValues: q, status: (q.length > 0 ? FetchStatus.OK : FetchStatus.EMPTY) }))
      .catch(ex => {
        if (ex instanceof Exception.FetchException) {
          if (ex.status == FetchStatus.UNAUTHORIZED) {
            Access.login()
            return
          }
          console.error('HTTP error status: ' + ex.httpStatus)
          this.setState({ skullValues: [], status: ex.status })
        } else {
          console.error(ex)
          this.setState({ skullValues: [], status: FetchStatus.ERROR })
        }
      })
  }

  confirmValue(value: ISkullValue) {
    this.setState({ selected: value })
  }

  cancel() {
    this.setState({ selected: undefined })
  }

  render() {
    switch (this.state.status) {
      case FetchStatus.LOADING:
        return <Message.Loading />
      case FetchStatus.OK:
      case FetchStatus.EMPTY:
        return (
          <div className='Skull'>
            <Grid skullValues={this.state.skullValues} confirmAction={this.confirmValue.bind(this)} />
            <Footer />
            {
              this.state.selected && <Confirmation
                skullValues={this.state.skullValues}
                selected={this.state.selected as unknown as ISkullValue}
                onCancel={this.cancel.bind(this)}
              />
            }
          </div>
        )
      case FetchStatus.UNAUTHORIZED:
        return <Message.Unauthorized />
      default:
        return <Message.Error />
    }
  }
}

export default Skull
