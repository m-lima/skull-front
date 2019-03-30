import React, { Component } from 'react'
import './css/Confirmation.css'

import { Icon } from './Icon'
import ISkullValue from '../model/ISkullValue'

interface IProps {
  skullValues: ISkullValue[]
  selected: ISkullValue
  onCancel: () => void
}

export default class Confirmation extends Component<IProps> {
  render() {
    return (
      <div className='Confirmation'>
        <div className='Confirmation-container'>
          <div className='Confirmation-values'>
            <select defaultValue={this.props.selected.type}>
              {this.props.skullValues.map((v, i) => <option key={i}>{v.type}</option>)}
            </select>
            <input id='amount' type='number' min={0} step={0.1} defaultValue={String(this.props.selected.amount)} />
          </div>
          <div className='Confirmation-buttons' onClick={this.props.onCancel}>
            <div id='Accept' title='Accept'>
              <Icon icon='fas fa-check' />
            </div>
            <div id='Cancel' title='Cancel' onClick={this.props.onCancel}>
              <Icon icon='fas fa-times' />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

