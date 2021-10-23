import React, { useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import './css/EditOccurrence.css'

import { ProtoOccurrence, Skull, SkullId } from '../model/Skull'
import Icon from './Icon'

interface IProps<T extends ProtoOccurrence> {
  value: T
  skulls: Skull[]
  onAccept: (value: T) => void
  onDelete?: () => void
  onCancel: () => void
}

interface StagedValue {
  skull: SkullId
  amount: string
  millis: number
}

function stage<T extends ProtoOccurrence>(occurrence: T, skulls: Skull[]): StagedValue {
  return {
    skull: occurrence!.skull,
    amount: String(occurrence!.amount),
    millis: occurrence!.millis,
  }
}

// TODO: Update other components to this funtional style
function EditOccurrence<T extends ProtoOccurrence>(props: IProps<T>) {
  const [shouldDelete, setShouldDelete] = useState(false)
  const [stagedValue, setStagedValue] = useState(stage(props.value, props.skulls))
  const amountRef = useRef<HTMLInputElement>(null)

  const isDeletable = () => props.onDelete !== undefined
  const commit = () => {
    if (shouldDelete) {
      props.onDelete!()
    } else {
      const amount = Number(stagedValue.amount)
      if (!amount) {
        amountRef.current!.focus()
        return
      }

      props.value.skull = stagedValue.skull
      props.value.amount = amount
      props.value.millis = stagedValue.millis
      props.onAccept(props.value)
    }
  }

  const renderInputs = () => {
    return (
      <div className='Edit-inputs' id={shouldDelete ? 'delete' : ''}>
        <div className='Edit-input'>
          <b>Type</b>
          <select
            value={stagedValue.skull.get(props.skulls).name}
            disabled={shouldDelete}
            onChange={e => {
              setStagedValue({ ...stagedValue, skull: new SkullId(e.target.value, props.skulls) })
            }}
          >
            {props.skulls.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        <div className='Edit-input'>
          <b>Amount</b>
          <input
            id={Number(stagedValue.amount) ? '' : 'invalid'}
            ref={amountRef}
            disabled={shouldDelete}
            type='text'
            inputMode='decimal'
            min={0}
            step={0.1}
            value={stagedValue.amount}
            onChange={e => {
              setStagedValue({ ...stagedValue, amount: e.target.value.replace(',', '.') })
            }}
          />
        </div>
        <div className='Edit-input'>
          <b>Time</b>
          <DatePicker
            disabled={shouldDelete}
            selected={new Date(stagedValue.millis)}
            showTimeSelect
            dateFormat='dd/MM/yyyy HH:mm'
            timeIntervals={5}
            popperPlacement='top'
            onChange={d => {
              setStagedValue({ ...stagedValue, millis: Number(d) })
            }}
           />
        </div>
        {isDeletable() &&
          <div className='Edit-input'>
            <div className='Edit-delete' onClick={() => setShouldDelete(!shouldDelete)}>
              <Icon icon='fas fa-trash' />
            </div>
          </div>
        }
      </div>
    )
  }

  return (
    <div className='Edit'>
      <div className='Edit-container'>
        {renderInputs()}
        <div className='Edit-buttons'>
          <div id='Accept' title='Accept' onClick={commit}>
            <Icon icon='fas fa-check' />
          </div>
          <div id='Cancel' title='Cancel' onClick={props.onCancel}>
            <Icon icon='fas fa-times' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditOccurrence
