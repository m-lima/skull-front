import React, { Component, Fragment } from 'react'
import './css/Confirmation.css'

import Icon from './Icon'

export interface IProps<T = {}> {
  value: T
  onAccept: (value: T) => void
  onCancel: () => void
}

export interface IState<T = {}> {
  value: T
}

export default class Confirmation<T, P extends IProps<T> = IProps<T>, S extends IState<T> = IState<T>> extends Component<P, S> {
  
  renderInputs() {
    return <Fragment></Fragment>
  }

  render() {
    return (
      <div className='Confirmation'>
        <div className='Confirmation-container'>
          {this.renderInputs()}
          <div className='Confirmation-buttons'>
            <div id='Accept' title='Accept' onClick={() => this.props.onAccept(this.state.value)}>
              <Icon icon='fas fa-check' />
            </div>
            <div id='Cancel' title='Cancel' onClick={this.props.onCancel}>
              <Icon icon='fas fa-times' />
            </div>
          </div>
        </div>
      </div>
      )
    }
  }
