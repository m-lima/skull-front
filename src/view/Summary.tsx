import React, { Component, Fragment } from 'react'
import './css/Summary.css'

import * as Message from './Message'
import * as Util from '../Util'
import Confirmation from './Confirmation'
import Icon from './Icon'
import { IOccurrence } from '../model/ISkull'

interface ISummary extends IOccurrence {
  dark: boolean
}

interface IProps {
  occurrence: IOccurrence[]
  delete: (occurrence: IOccurrence) => void
}

interface IState {
  selected?: IOccurrence
}

const alternateDays = (occurence: IOccurrence[]): ISummary[] => {
  let millis = 0
  let dark = false
  return occurence.map(v => {
    const newValue = Util.normalizeDate(v)
    if (newValue.millis !== millis) {
      millis = newValue.millis
      dark = !dark
    }
    return { id: v.id, skull: v.skull, amount: v.amount, millis: v.millis, dark: dark}
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

  renderRow(value: ISummary, index: number) {
    return (
      <tr id={value.dark ? 'dark' : 'bright'} key={index}>
        <td id='icon' style={{ color: value.skull.color.toHexString() }}>
          <Icon icon={ value.skull.icon } />
        </td>
        <td>{value.skull.name}</td>
        <td>{value.amount}</td>
        <td>{formatDate(value.millis)}</td>
        <td id='delete' onClick={() => this.setState({ selected: value })}>
          <Icon icon='fas fa-trash-alt' />
        </td>
      </tr>
    )
  }

  render = () =>
    this.props.occurrence.length < 1
      ? <Message.Empty />
      : <Fragment>
          <table className='Summary'>
            <tbody>
            <tr>
              <th id='icon'></th>
              <th>Name</th>
              <th>Count</th>
              <th>Time</th>
              <th id='icon'></th>
            </tr>
            {alternateDays(this.props.occurrence).map(this.renderRow)}
            </tbody>
          </table>
          <Confirmation
              types={this.props.occurrence.map(v => v.skull.name)}
              value={this.state.selected}
              onAccept={this.accept}
              onCancel={this.cancel}
          />
        </Fragment>
}

