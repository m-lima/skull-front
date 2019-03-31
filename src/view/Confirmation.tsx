import React, { Component, Fragment } from 'react'
import './css/Confirmation.css'

import ISkullValue from '../model/ISkullValue'
import Icon from './Icon'

interface IProps {
  types: string[]
  visible: boolean
  onAccept: (skullValue: ISkullValue) => void
  onCancel: () => void
}

interface IState {
  selected: ISkullValue
}

export default class Confirmation extends Component<IProps, IState> {
  state = {
    selected: { type: '', amount: 0},
  }

  buildComboBox() {
    return (
      <select
        value={this.state.selected.type}
        onChange={e => {
          this.state.selected.type = e.target.value
          this.setState({ selected: this.state.selected })
        }}
      >
        {this.props.types.map((v, i) => <option key={i} value={v}>{v}</option>)}
      </select>
    )
  }

  render() {
    return (
      <Fragment>
        {this.props.visible &&
          <div className='Confirmation'>
            <div className='Confirmation-container'>
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
                    value={String(this.state.selected.amount)}
                    onChange={e => {
                      this.state.selected.amount = Number(e.target.value)
                      this.setState({ selected: this.state.selected })
                    }}
                  />
                </div>
              </div>
              <div className='Confirmation-buttons'>
                <div id='Accept' title='Accept' onClick={() => this.props.onAccept(this.state.selected)}>
                  <Icon icon='fas fa-check' />
                </div>
                <div id='Cancel' title='Cancel' onClick={this.props.onCancel}>
                  <Icon icon='fas fa-times' />
                </div>
              </div>
            </div>
          </div>
        }
      </Fragment>
      )
    }
  }
