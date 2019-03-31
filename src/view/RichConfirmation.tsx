import React, { Component, Fragment } from 'react'
import Confirmation, { IProps } from './Confirmation'
import './css/RichConfirmation.css'

import ISkullValue, { IQuickValue } from '../model/ISkullValue'

interface IRichProps extends IProps<ISkullValue> {
  types: string[]
  onChange: (value: ISkullValue) => void
}

export default class RichConfirmation extends Confirmation<ISkullValue, IRichProps> {

  buildComboBox() {
    return (
      <select
        value={this.getValue().type}
        onChange={e => {
          this.getValue().type = e.target.value
          this.props.onChange(this.getValue())
        }}
      >
        {this.props.types.map((v, i) => <option key={i} value={v}>{v}</option>)}
      </select>
    )
  }

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
