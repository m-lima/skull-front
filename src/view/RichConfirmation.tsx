import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import Confirmation, { IProps } from './Confirmation'
import './css/RichConfirmation.css'

import { Occurrence as FullOccurrence, ProtoOccurrence, Skull } from '../model/Skull'

type Occurrence = ProtoOccurrence|FullOccurrence

interface IRichProps extends IProps<Occurrence> {
  skulls: Skull[]
  onChange: (skull: Occurrence) => void
}

export default class RichConfirmation extends Confirmation<Occurrence, IRichProps> {

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
        <div className='Confirmation-input'>
          <b>Time</b>
          <DatePicker
             selected={this.getValue().date}
             showTimeSelect
             dateFormat='dd/MM/yyyy HH:mm'
             timeIntervals={5}
             popperPlacement='top'
             onChange={d => {
               this.getValue().date = new Date(Number(d))
               this.props.onChange(this.getValue())
             }}
           />
        </div>
      </div>
    )
  }
}
