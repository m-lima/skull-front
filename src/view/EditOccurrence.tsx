import React, { Component, Fragment } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import './css/EditOccurrence.css'

import { Occurrence as FullOccurrence, ProtoOccurrence, Skull } from '../model/Skull'
import Icon from './Icon'

type Occurrence = ProtoOccurrence|FullOccurrence

interface IRichProps {
  value?: Occurrence
  skulls: Skull[]
  onAccept: (del: boolean) => void
  onCancel: () => void
  onChange: (skull: Occurrence) => void
}

interface IRichState {
  delete: boolean
}

export default class EditOccurrence extends Component<IRichProps, IRichState> {

  constructor(props: IRichProps) {
    super(props)
    this.state = { delete: false }
  }

  private getValue(): Occurrence {
    return this.props.value as Occurrence
  }

  renderInputs() {
    // TODO: Allow amount to be *momentarily* empty
    return (
      <div className='Edit-inputs' id={this.state.delete ? 'delete' : ''}>
        <div className='Edit-input'>
          <b>Type</b>
          <select
            value={this.getValue().skull.name}
            disabled={this.state.delete}
            onChange={e => {
              this.getValue().skull = this.props.skulls.find(s => s.name === e.target.value)!
              this.props.onChange(this.getValue())
            }}
          >
            {this.props.skulls.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        <div className='Edit-input'>
          <b>Amount</b>
          <input
            disabled={this.state.delete}
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
        <div className='Edit-input'>
          <b>Time</b>
          <DatePicker
            disabled={this.state.delete}
            selected={new Date(this.getValue().millis)}
            showTimeSelect
            dateFormat='dd/MM/yyyy HH:mm'
            timeIntervals={5}
            popperPlacement='top'
            onChange={d => {
              this.getValue().millis = Number(d)
              this.props.onChange(this.getValue())
            }}
           />
        </div>
      </div>
    )
  }

  render() {
    return (
      <Fragment>
        {this.getValue() && <div className='Edit'>
          <div className='Edit-container'>
            {this.renderInputs()}
            <div className='Edit-delete' id={this.state.delete ? 'delete' : ''} onClick={() => this.setState({ delete: !this.state.delete })}>
              <Icon icon='fas fa-trash' />
            </div>
            <div className='Edit-buttons'>
              <div id='Accept' title='Accept' onClick={() => this.props.onAccept(this.state.delete)}>
                <Icon icon='fas fa-check' />
              </div>
              <div id='Cancel' title='Cancel' onClick={this.props.onCancel}>
                <Icon icon='fas fa-times' />
              </div>
            </div>
          </div>
        </div>}
      </Fragment>
      )
    }
}
