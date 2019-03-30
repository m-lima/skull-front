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
          <div className='Confirmation-inputs'>
            <div className='Confirmation-input'>
              <b>Type</b>
              <select defaultValue={this.props.selected.type}>
                {this.props.skullValues.map((v, i) => <option key={i} value={v.type}>{v.type}</option>)}
              </select>
            </div>
            <div className='Confirmation-input'>
              <b>Amount</b>
              <input id='amount' type='number' min={0} step={0.1} defaultValue={String(this.props.selected.amount)} />
            </div>
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

