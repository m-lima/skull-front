import React, { Component, Fragment } from 'react'
import Confirmation, { IProps, IState } from './Confirmation'
import './css/RichConfirmation.css'

import ISkullValue, { IQuickValue } from '../model/ISkullValue'

interface IRichProps extends IProps<ISkullValue> {
  types: string[]
  onAccept: (skullValue: ISkullValue) => void
  onCancel: () => void
}

export default class RichConfirmation extends Confirmation<ISkullValue, IRichProps> {
  state = {
    value: this.props.value,
  }

  buildComboBox() {
    return (
      <select
        value={this.state.value.type}
        onChange={e => {
          this.state.value.type = e.target.value
          this.setState({ value: this.state.value })
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
            value={String(this.state.value.amount)}
            onChange={e => {
              this.state.value.amount = Number(e.target.value)
              this.setState({ value: this.state.value })
            }}
          />
        </div>
      </div>
    )
  }
}
