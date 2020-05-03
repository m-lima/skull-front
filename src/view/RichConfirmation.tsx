import React from 'react'
import Confirmation, { IProps } from './Confirmation'
import './css/RichConfirmation.css'

import { ISkull, IValuedSkull } from '../model/ISkull'

interface IRichProps extends IProps<IValuedSkull> {
  skulls: ISkull[]
  onChange: (skull: IValuedSkull) => void
}

export default class RichConfirmation extends Confirmation<IValuedSkull, IRichProps> {

  buildComboBox() {
    return (
      <select
        value={this.getValue().skull.name}
        onChange={e => {
          this.getValue().skull.name = e.target.value
          this.props.onChange(this.getValue())
        }}
      >
        {this.props.skulls.map((s, i) => <option key={i} value={s.name}>{s}</option>)}
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
            min={0}
            step={0.1}
            value={String(this.getValue().amount)}
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
