import React, { Component, Fragment } from 'react'
import './css/Grid.css'
import './css/Confirmation.css'

import { Skull, ValuedSkull, ValuedSkull as Quick} from '../model/Skull'
import Icon from './Icon'
import RichConfirmation from './RichConfirmation'

interface IProps {
  skulls: Skull[]
  quicks: Quick[]
  push: (skull: ValuedSkull) => void
}

interface IState {
  selected?: ValuedSkull
}

export default class Grid extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = { selected: undefined }
    this.change = this.change.bind(this)
    this.accept = this.accept.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  showConfirmation(quick: Quick) {
    this.setState({ selected: { skull: quick.skull, amount: quick.amount } })
  }

  change(value: ValuedSkull) {
    this.setState({ selected: value })
  }

  accept() {
    const selected = this.state.selected!
    this.setState({ selected: undefined })
    this.props.push(selected)
  }

  cancel() {
    this.setState({ selected: undefined })
  }

  buildSkullButton(quick: Quick, index?: number) {
    return (
        <div
            key={index}
            className='Grid-button'
            title={quick.skull.name + ': ' + quick.amount}
            style={{background: quick.skull.color}}
            onClick={() => this.showConfirmation(quick)}
        >
          <Icon icon={quick.skull.icon}/>
        </div>
    )
  }

  // TODO: Render skulls that do not have a quick
  render = () =>
    <Fragment>
      <div className='Grid' >
        {this.props.skulls && this.props.quicks && this.props.quicks.map((q, i) => this.buildSkullButton(q, i))}
      </div>
      <RichConfirmation
        skulls={this.props.skulls}
        value={this.state.selected}
        onChange={this.change}
        onAccept={this.accept}
        onCancel={this.cancel}
      />
    </Fragment>
}
