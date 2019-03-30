import React, { Component } from 'react'
import './css/SkullButton.css'

import ISkullValue from '../model/ISkullValue'
import { Icon } from './Icon'

export default class SkullButton extends Component<ISkullValue> {
  render() {
    return (
      <div className='Skull-button' title={this.props.type + ': ' + this.props.amount}>
        <Icon icon={this.props.icon} />
      </div>
    )
  }
}
