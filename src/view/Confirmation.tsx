import React, { Component } from 'react'
import './css/Confirmation.css'

import ISkullValue from '../model/ISkullValue'
import Icon from './Icon'

interface IProps {
  skullValues: ISkullValue[]
  selected: ISkullValue
  onUpdate: (amount: string | number) => void
  onAccept: () => void
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
              <select value={this.props.selected.type} onChange={e => this.props.onUpdate(e.target.value)}>
                {this.props.skullValues.map((v, i) => <option key={i} value={v.type}>{v.type}</option>)}
              </select>
            </div>
            <div className='Confirmation-input'>
              <b>Amount</b>
              <input
                id='amount'
                type='number'
                min={0}
                step={0.1}
                value={String(this.props.selected.amount)}
                onChange={e => this.props.onUpdate(Number(e.target.value))}
              />
            </div>
          </div>
          <div className='Confirmation-buttons' onClick={this.props.onAccept}>
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

