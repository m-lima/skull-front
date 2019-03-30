import React, { Component } from 'react'
import './css/Skull.css'

import * as Exception from '../model/Exception'
import * as Message from './Message'
import Access from '../control/Access'
import Confirmation from './Confirmation'
import Fetch from '../control/Fetch'
import FetchStatus from '../model/FetchStatus'
import Footer from './Footer'
import IQuickValue from '../model/IQuickValue'
import SkullButton from './SkullButton'

const Grid = (props: { quickValues: IQuickValue[]}) => {
  return (
    <div className='Skull-grid' >
      {props.quickValues && props.quickValues.map((q, i) => <SkullButton {...q} key={i} />)}
      <SkullButton icon='fas fa-question-circle' type='custom' amount={0} />
    </div>
  )
}

interface IState {
  quickValues: IQuickValue[]
  status: FetchStatus
}

interface IProps { }

class Skull extends Component<IProps, IState> {
  state = {
    quickValues: [],
    status: FetchStatus.LOADING,
  }

  componentDidMount() {
    Fetch.quickValues()
      .then(q => this.setState({ quickValues: q, status: (q.length > 0 ? FetchStatus.OK : FetchStatus.EMPTY) }))
      .catch(ex => {
        if (ex instanceof Exception.FetchException) {
          if (ex.status == FetchStatus.UNAUTHORIZED) {
            Access.login()
            return
          }
          console.error('HTTP error status: ' + ex.httpStatus)
          this.setState({ quickValues: [], status: ex.status })
        } else {
          console.error(ex)
          this.setState({ quickValues: [], status: FetchStatus.ERROR })
        }
      })
  }

  render() {
    switch (this.state.status) {
      case FetchStatus.LOADING:
        return <Message.Loading />
      case FetchStatus.OK:
      case FetchStatus.EMPTY:
        return (
          <div className='Skull'>
            <Grid quickValues={this.state.quickValues} />
            <Footer />
            <Confirmation />
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
