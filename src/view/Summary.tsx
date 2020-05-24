import React, { Fragment, PureComponent } from 'react'
import './css/Summary.css'

import * as Message from './Message'
import * as Util from '../Util'
import Confirmation from './Confirmation'
import Icon from './Icon'
import { Occurrence } from '../model/Skull'

class ISummaryOccurrence extends Occurrence {
  dark = false
}

interface IProps {
  occurrences: Occurrence[]
  delete: (occurrence: Occurrence) => void
}

interface IState {
  selected?: Occurrence
}

const alternateDays = (occurrences: Occurrence[]): ISummaryOccurrence[] => {
  let millis = 0
  let dark = false
  return occurrences.map(o => {
    const newValue = Util.normalizeDate(o)
    if (newValue.millis !== millis) {
      millis = newValue.millis
      dark = !dark
    }
    return { id: o.id, skull: o.skull, amount: o.amount, millis: o.millis, dark: dark}
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

export default class Summary extends PureComponent<IProps, IState> {

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

  renderRow(occurrence: ISummaryOccurrence, index: number) {
    return (
      <tr id={occurrence.dark ? 'dark' : 'bright'} key={index}>
        <td id='icon' style={{ color: occurrence.skull.color }}>
          <Icon icon={ occurrence.skull.icon } />
        </td>
        <td>{occurrence.skull.name}</td>
        <td>{occurrence.amount}</td>
        <td>{formatDate(occurrence.millis)}</td>
        <td id='delete' onClick={() => this.setState({ selected: occurrence })}>
          <Icon icon='fas fa-trash-alt' />
        </td>
      </tr>
    )
  }

  render = () =>
    this.props.occurrences.length < 1
      ? <Message.Empty />
      : <Fragment>
          <table className='Summary'>
            <tbody>
            <tr>
              <th id='icon'></th>
              <th>Name</th>
              <th>Amount</th>
              <th>Time</th>
              <th id='icon'></th>
            </tr>
            {alternateDays(this.props.occurrences).map(this.renderRow)}
            </tbody>
          </table>
          <Confirmation
              types={this.props.occurrences.map(o => o.skull.name)}
              value={this.state.selected}
              onAccept={this.accept}
              onCancel={this.cancel}
          />
        </Fragment>
}

