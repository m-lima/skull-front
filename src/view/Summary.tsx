import React, { Component, Fragment } from 'react'
import './css/Summary.css'

import * as Message from './Message'
import * as Util from '../Util'
import Confirmation from './Confirmation'
import Icon from './Icon'
import { IRegisteredValue } from '../model/ISkullValue'

interface ISummaryValue extends IRegisteredValue {
  dark: boolean
}

interface IProps {
  skullValues: IRegisteredValue[]
  icons: Map<string, string>
  delete: (skullValue: IRegisteredValue) => void
}

interface IState {
  selected?: IRegisteredValue
}

const alternateDays = (skullValues: IRegisteredValue[]) => {
  let millis = 0
  let dark = false
  return skullValues.map((v): ISummaryValue=> {
    const newValue = Util.normalizeDate(v)
    if (newValue.millis !== millis) {
      millis = newValue.millis
      dark = !dark
    }
    return { type: v.type, amount: v.amount, millis: v.millis, dark: dark}
  })
}

const formatDate = (millis: number) => {
  const date = new Date(millis)
  return Util.addLeadingZero(date.getDate())
      + '/' + Util.mapMonthToName(date.getMonth())
      + '/' + date.getFullYear()
      + ' '
      + Util.addLeadingZero(date.getHours())
      + ':' + Util.addLeadingZero(date.getMinutes())
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

  renderRow(value: ISummaryValue, index: number) {
    return (
      <tr id={value.dark ? 'dark' : 'bright'} key={index}>
        <td>
          {this.props.icons.has(value.type + value.amount)
          && <Icon icon={this.props.icons.get(value.type + value.amount) as string} />}
        </td>
        <td>{value.type}</td>
        <td>{value.amount}</td>
        <td>{formatDate(value.millis)}</td>
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
              <th>Count</th>
              <th>Time</th>
              <th id='icon'></th>
            </tr>
            {alternateDays(this.props.skullValues).map(this.renderRow)}
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

