import React from 'react'
import Confirmation, { IProps } from './Confirmation'
import './css/RichConfirmation.css'

import { Skull, ValuedSkull } from '../model/Skull'

interface IRichProps extends IProps<ValuedSkull> {
  skulls: Skull[]
  onChange: (skull: ValuedSkull) => void
}

export default class RichConfirmation extends Confirmation<ValuedSkull, IRichProps> {

  buildComboBox() {
    return (
      <select
        value={this.getValue().skull.name}
        onChange={e => {
          this.getValue().skull = this.props.skulls.find(s => s.name === e.target.value)!
          this.props.onChange(this.getValue())
        }}
      >
        {this.props.skulls.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
      </select>
    )
  }

  // TODO: iOS doesn't like the fractional number input
  renderInputs() {
    return (
      <div className='Confirmation-inputs'>
        <div className='Confirmation-input'>
          <b>Type</b>
          {this.buildComboBox()}
        </div>
        <div className='Confirmation-input'>
          <b>Amount</b>
          <input
            id='amount'
            type='number'
            inputMode='decimal'
            min={0}
            step={0.1}
            value={this.getValue().amount}
            onChange={e => {
              this.getValue().amount = Number(e.target.value)
              this.props.onChange(this.getValue())
            }}
          />
        </div>
      </div>
    )
  }
}
