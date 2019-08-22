import React, { Component, Fragment } from 'react'
import './css/Summary.css'

import * as Message from './Message'
import Confirmation from './Confirmation'
import Icon from './Icon'
import { IRegisteredValue } from '../model/ISkullValue'

interface IProps {
  skullValues: IRegisteredValue[]
  icons: Map<string, string>
  delete: (skullValue: IRegisteredValue) => void
}

interface IState {
  selected?: IRegisteredValue
}

export default class Summary extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = { selected: undefined }
    this.renderRow = this.renderRow.bind(this)
    this.accept = this.accept.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  accept() {
    const selected = this.state.selected!
    this.setState({ selected: undefined })
    this.props.delete(selected)
  }

  cancel() {
    this.setState({ selected: undefined })
  }

  renderRow(value: IRegisteredValue, index: number) {
    return (
      <tr key={index}>
        <td>
          {this.props.icons.has(value.type + value.amount) && <Icon icon={this.props.icons.get(value.type + value.amount) as string} />}
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

  render = () =>
    this.props.skullValues.length < 1
      ? <Message.Empty />
      : <Fragment>
          <table className='Summary'>
            <tbody>
            <tr>
              <th id='icon'></th>
              <th>Type</th>
              <th>Amount</th>
              <th>Time</th>
              <th id='icon'></th>
            </tr>
            {this.props.skullValues.map(this.renderRow)}
            </tbody>
          </table>
          <Confirmation
              types={this.props.skullValues.map(v => v.type)}
              value={this.state.selected}
              onAccept={this.accept}
              onCancel={this.cancel}
          />
        </Fragment>
}

