import React, { Component } from 'react'
import './css/SkullButton.css'

import IQuickValue from '../model/IQuickValue'
import { Icon } from './Icon'

export default class SkullButton extends Component<IQuickValue> {
  render() {
    return (
      <div className='Skull-button' title={this.props.type + ': ' + this.props.amount}>
        <Icon icon={this.props.icon} />
      </div>
    )
  }
}
