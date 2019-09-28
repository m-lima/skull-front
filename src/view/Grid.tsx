import React, { Component, Fragment } from 'react'
import './css/Grid.css'
import './css/Confirmation.css'

import * as Util from '../Util'
import ISkullValue, { IQuickValue } from '../model/ISkullValue'
import Icon from './Icon'
import RichConfirmation from './RichConfirmation'

interface IProps {
  skullValues: IQuickValue[]
  push: (skullValue: ISkullValue) => void
}

interface IState {
  selected?: ISkullValue
}

export default class Grid extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = { selected: undefined }
    this.change = this.change.bind(this)
    this.accept = this.accept.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  showConfirmation(skullValue: ISkullValue) {
    this.setState({ selected: { type: skullValue.type, amount: skullValue.amount } })
  }

  change(value: ISkullValue) {
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

  buildSkullButton(skullValue: IQuickValue, index?: number) {
    return (
      <div
        key={index}
        className='Grid-button'
        title={skullValue.type + ': ' + skullValue.amount}
        style={{ background: Util.getColorFromType(skullValue.type) }}
        onClick={() => this.showConfirmation(skullValue)}
      >
        <Icon icon={skullValue.icon} />
      </div>
    )
  }

  render = () =>
    <Fragment>
      <div className='Grid' >
        {this.props.skullValues && this.props.skullValues.map((q, i) => this.buildSkullButton(q, i))}
      </div>
      <RichConfirmation
        types={this.props.skullValues.map(v => v.type)}
        value={this.state.selected}
        onChange={this.change}
        onAccept={this.accept}
        onCancel={this.cancel}
      />
    </Fragment>
}
