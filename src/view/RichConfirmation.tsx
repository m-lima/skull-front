import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import Confirmation, { IProps } from './Confirmation'
import './css/RichConfirmation.css'

import { Occurrence as FullOccurrence, ProtoOccurrence, Skull } from '../model/Skull'
import Icon from './Icon'

type Occurrence = ProtoOccurrence|FullOccurrence

interface IRichProps extends IProps<Occurrence> {
  skulls: Skull[]
  onChange: (skull: Occurrence) => void
}

interface IRichState {
  delete: boolean
}

export default class RichConfirmation extends Confirmation<Occurrence, IRichProps, IRichState> {

  constructor(props: IRichProps) {
    super(props)
    this.state = { delete: false }
  }

  buildComboBox() {
    return (
      <select
        value={this.getValue().skull.name}
        disabled={this.state.delete}
        id={this.state.delete ? 'delete' : ''}
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
    // TODO: Allow amount to be *momentarily* empty
    return (
      <>
        <div className='Confirmation-inputs'>
          <div className='Confirmation-input'>
            <b>Type</b>
            {this.buildComboBox()}
          </div>
          <div className='Confirmation-input'>
            <b>Amount</b>
            <input
              disabled={this.state.delete}
              id={this.state.delete ? 'delete' : ''}
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
              disabled={this.state.delete}
              id={this.state.delete ? 'delete' : ''}
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
        <div className='Confirmation-delete' id={this.state.delete ? 'delete' : ''} onClick={() => this.setState({ delete: !this.state.delete })}>
          <Icon icon='fas fa-trash' />
        </div>
      </>
    )
  }
}
