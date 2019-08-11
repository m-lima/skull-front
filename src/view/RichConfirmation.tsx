import React, { Component, Fragment } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import './css/RichConfirmation.css'

import Confirmation, { IProps } from './Confirmation'
import { IQuickValue, IRegisteredValue } from '../model/ISkullValue'

interface IRichProps extends IProps<IRegisteredValue> {
  types: string[]
  onChange: (value: IRegisteredValue) => void
}

export default class RichConfirmation extends Confirmation<IRegisteredValue, IRichProps> {

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
        <div className='Confirmation-input'>
          <b>Time</b>
          <DatePicker
            selected={new Date(this.getValue().millis)}
            showTimeSelect
            dateFormat='dd/MM/yyyy HH:mm'
            timeIntervals={5}
            popperPlacement='top'
            popperModifiers={{
              preventOverflow: {
                enabled: true,
                escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                boundariesElement: 'window'
              }
            }}
            onChange={d => {
              console.log(d)
              console.log(Number(d))
              this.getValue().millis = Number(d)
              this.props.onChange(this.getValue())
            }}
          />
        </div>
      </div>
    )
  }
}
          // <input
          //   id='time'
          //   type='datetime-local'
          //   value={new Date().toLocaleString()}
          //   onChange={e => {
          //     console.log(e.target.value)
          //     this.getValue().millis = Number(e.target.value)
          //     this.props.onChange(this.getValue())
          //   }}
          // />
