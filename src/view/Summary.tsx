import React, { Component, Fragment } from 'react'
import './css/Summary.css'

import * as Message from './Message'
import * as Util from '../Util'
import EditOccurrence from './EditOccurrence'
import Icon from './Icon'
import { Occurrence, Skull } from '../model/Skull'

class ISummaryOccurrence extends Occurrence {
  dark = false
}

interface IProps {
  skulls: Skull[]
  occurrences: Occurrence[]
  update: (occurrence: Occurrence, skull: Skull) => void
  delete: (occurrence: Occurrence) => void
}

interface IState {
  selected?: Occurrence,
  max: number,
}

const ROW_INCREMENT = 100;

const alternateDays = (occurrences: Occurrence[]): ISummaryOccurrence[] => {
  let date: number = 0
  let dark = false
  return occurrences.map(o => {
    const day = Util.normalizeDate(o).millis
    if (day !== date) {
      date = day
      dark = !dark
    }
    return { id: o.id, skull: o.skull, amount: o.amount, millis: o.millis, dark: dark}
  })
}

const formatDate = (date: Date) => {
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
    this.state = { selected: undefined, max: ROW_INCREMENT }
    this.renderRow = this.renderRow.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  update(occurrence: Occurrence) {
    this.cancel()
    this.props.update(occurrence, occurrence.skull.get(this.props.skulls))
  }

  delete() {
    const selected = this.state.selected!
    this.cancel()
    this.props.delete(selected)
  }

  cancel() {
    this.setState({ selected: undefined })
  }

  renderRow(occurrence: ISummaryOccurrence, index: number) {
    const skull = occurrence.skull.get(this.props.skulls)
    return (
      <tr id={occurrence.dark ? 'dark' : 'bright'} key={index} onClick={() => this.setState({ selected: occurrence })}>
        <td id='icon' style={{ color: skull.color }}>
          <Icon icon={ skull.icon } />
        </td>
        <td>{skull.name}</td>
        <td>{occurrence.amount}</td>
        <td>{formatDate(new Date(occurrence.millis))}</td>
      </tr>
    )
  }

  fullyLoaded() {
    return this.state.max >= this.props.occurrences.length
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
            </tr>
            {alternateDays(this.props.occurrences).slice(0, this.state.max).map(this.renderRow)}
            </tbody>
          </table>
          {this.fullyLoaded() || <Icon id='next' icon='fas fa-angle-double-down' onClick={() => this.setState({ max: this.state.max + ROW_INCREMENT })} />}
          {this.state.selected && <EditOccurrence
              skulls={this.props.skulls}
              value={this.state.selected!}
              onAccept={this.update}
              onDelete={this.delete}
              onCancel={this.cancel}
          />}
        </Fragment>
}

