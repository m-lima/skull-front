import React, { Component, Fragment } from 'react'
import './css/Grid.css'
import './css/Confirmation.css'

import * as Util from '../Util'
import {IOccurrence, ISkull, IValuedSkull, IValuedSkull as IQuick} from '../model/ISkull'
import Icon from './Icon'
import RichConfirmation from './RichConfirmation'

interface IProps {
  skull: ISkull[]
  quick: IQuick[]
  push: (skull: IValuedSkull) => void
}

interface IState {
  selected?: IValuedSkull
}

export default class Grid extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = { selected: undefined }
    this.change = this.change.bind(this)
    this.accept = this.accept.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  showConfirmation(quick: IQuick) {
    this.setState({ selected: { skull: quick.skull, amount: quick.amount } })
  }

  change(value: IValuedSkull) {
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

  buildSkullButton(quick: IQuick, index?: number) {
    return (
        // TODO: Make dedicated class for quick button
        <div
            key={index}
            className='Grid-button'
            title={quick.skull.name + ': ' + quick.amount}
            style={{background: skull.color.toHexString()}}
            onClick={() => this.showConfirmation(quick)}
        >
          <Icon icon={quick.skull.icon}/>
        </div>
    )
  }

  render = () =>
    <Fragment>
      <div className='Grid' >
        {this.props.skull && this.props.quick && this.props.quick.map((q, i) => this.buildSkullButton(q, i))}
      </div>
      <RichConfirmation
        types={this.props.skull.map(v => v.name)}
        value={this.state.selected}
        onChange={this.change}
        onAccept={this.accept}
        onCancel={this.cancel}
      />
    </Fragment>
}
