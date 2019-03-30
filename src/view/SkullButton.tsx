import React, { Component } from 'react'
import './css/SkullButton.css'
import IQuickValue from '../model/IQuickValue'

export default class SkullButton extends Component<IQuickValue> {
  render() {
    return (
      <div className='Skull-button'>
        <i className={this.props.icon} />
      </div>
    )
  }
}
