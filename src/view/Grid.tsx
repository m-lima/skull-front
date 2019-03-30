import React, { Component } from 'react'
import './css/Grid.css'

import ISkullValue from '../model/ISkullValue'
import { Icon } from './Icon'

interface IProps {
  skullValues: ISkullValue[]
  confirmAction: (value: ISkullValue) => void
}

export default class Grid extends Component<IProps> {
  types: string[] = []

  buildSkullButton(skullValue: ISkullValue, index?: number) {
    return (
      <div
        key={index}
        className='Skull-button'
        title={skullValue.type + ': ' + skullValue.amount}
        onClick={() => this.props.confirmAction(skullValue)}
      >
        <Icon icon={skullValue.icon} />
      </div>
    )
  }

  render() {
    return (
      <div className='Skull-grid' >
        {this.props.skullValues && this.props.skullValues.map((q, i) => this.buildSkullButton(q, i))}
        {this.buildSkullButton({ type: 'custom', amount: 1, icon: 'fas fa-question-circle'})}
      </div>
    )
  }
}
