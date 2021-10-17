import React, { Component, Fragment } from 'react'
import './css/Grid.css'

import { Occurrence, Skull, ProtoOccurrence, ValuedSkull as Quick} from '../model/Skull'
import Icon from './Icon'
import EditOccurrence from './EditOccurrence'

type SkullId = number

interface IProps {
  skulls: Skull[]
  quicks: Quick[]
  occurrences: Occurrence[]
  push: (skull: ProtoOccurrence) => void
}

interface IState {
  selected?: ProtoOccurrence
}

class SkullAmount {
  skull: SkullId
  amount: number

  constructor(skull: SkullId, amount: number) {
    this.skull = skull
    this.amount = amount
  }
}

const THREE_QUARTERS = 0.75

const idForQuick = (skullAmounts: Map<SkullId, number>, quick: Quick) => {
   if (quick.skull.limit && skullAmounts.has(quick.skull.id)) {
    const skullAmount = skullAmounts.get(quick.skull.id)! + quick.amount
    if (skullAmount > quick.skull.limit * THREE_QUARTERS) {
      return 'Grid-button-over-limit'
    } else if (skullAmount > quick.skull.limit * 0.8 * THREE_QUARTERS) {
      return 'Grid-button-near-limit'
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}

export default class Grid extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = { selected: undefined }
    this.accept = this.accept.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  showConfirmation(quick: Quick) {
    this.setState({ selected: { skull: quick.skull, amount: quick.amount, millis: new Date().getTime() } })
  }

  accept(occurrence: ProtoOccurrence) {
    this.setState({ selected: undefined })
    this.props.push(occurrence)
  }

  cancel() {
    this.setState({ selected: undefined })
  }

  buildSkullButton = (skullAmounts: Map<SkullId, number>, quick: Quick, index?: number) =>
    <div
        key={index}
        className='Grid-button'
        title={
          'Skull: ' + quick.skull.name
          + '\nAmount: ' + quick.amount
          + (quick.skull.limit ? '\nLimit: ' + quick.skull.limit : '')
        }
        style={{background: quick.skull.color}}
        onClick={() => this.showConfirmation(quick)}
    >
      <Icon icon={quick.skull.icon}/>
      <div
          className='Grid-button-amount'
          id={idForQuick(skullAmounts, quick)}
      >
        {quick.amount}
      </div>
    </div>

  render() {
    const threeQuartersOfADayAgo = new Date().getTime() - THREE_QUARTERS * 24 * 60 * 60 * 1000;
    const skullAmounts = this.props.occurrences
        .filter(o => o.millis > threeQuartersOfADayAgo)
        .map(o => new SkullAmount(o.skull.id, o.amount))
        .reduce((acc, curr) => {
          let amount = acc.get(curr.skull)
          if (amount) {
            amount += curr.amount
          } else {
            amount = curr.amount
          }
          acc.set(curr.skull, amount)
          return acc
        }, new Map<SkullId, number>())

    return (
        <Fragment>
          <div className='Grid'>
            {this.props.skulls && this.props.quicks && this.props.quicks.map((q, i) => this.buildSkullButton(skullAmounts, q, i))}
          </div>
          {this.state.selected && <EditOccurrence
              skulls={this.props.skulls}
              value={this.state.selected!}
              onAccept={this.accept}
              onCancel={this.cancel}
          />}
        </Fragment>
    )
  }
}
