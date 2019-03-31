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
  selected: ISkullValue
  showConfirmation: boolean
}

export default class Grid extends Component<{}, IState> {

  constructor(props: {}) {
    super(props)
    this.update = this.update.bind(this)
    this.accept = this.accept.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  componentDidMount() {
    this.setState({ skullValues: [], status: Status.LOADING, showConfirmation: false, selected: { type: 'custom', amount: 0 } })
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
    this.setState({ showConfirmation: true, selected: { type: skullValue.type, amount: skullValue.amount } })
  }

  update(value: string | number) {
    if (typeof value === 'string') {
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

  // renderConfirmation() {
  //   return(
  //     <div className='Confirmation'>
  //       <div className='Confirmation-container'>
  //         <div className='Confirmation-inputs'>
  //           <div className='Confirmation-input'>
  //             <b>Type</b>
  //             <select value={this.state.selected.type} onChange={e => this.update(e.target.value)}>
  //               {this.state.skullValues.map((v, i) => <option key={i} value={v.type}>{v.type}</option>)}
  //             </select>
  //           </div>
  //           <div className='Confirmation-input'>
  //             <b>Amount</b>
  //             <input
  //               id='amount'
  //               type='number'
  //               min={0}
  //               step={0.1}
  //               value={String(this.state.selected.amount)}
  //               onChange={e => this.update(Number(e.target.value))}
  //             />
  //           </div>
  //         </div>
  //         <div className='Confirmation-buttons'>
  //           <div id='Accept' title='Accept' onClick={this.accept}>
  //             <Icon icon='fas fa-check' />
  //           </div>
  //           <div id='Cancel' title='Cancel' onClick={this.cancel}>
  //             <Icon icon='fas fa-times' />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

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
            {/* {this.state.showConfirmation && <Confirmation display={this.state.showConfirmation} skullValues={this.state.skullValues} selected={this.state.selected} onAccept={this.accept} onCancel={this.cancel} onUpdate={this.update} />} */}
            <Confirmation display={this.state.showConfirmation} skullValues={this.state.skullValues} selected={this.state.selected} onAccept={this.accept} onCancel={this.cancel} onUpdate={this.update} />
          </Fragment>
      )
      case Status.FORBIDDEN:
        return <Message.Unauthorized />
      case Status.ERROR:
        return <Message.Error />
    }
  }
}
