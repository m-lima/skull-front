import React, { Component, Fragment } from 'react'
import './css/Confirmation.css'

import Icon from './Icon'

export interface IProps<T> {
  value?: T
  onAccept: () => void
  onCancel: () => void
}

export default class Confirmation<T, P extends IProps<T> = IProps<T>> extends Component<P> {

  protected getValue(): T {
    return this.props.value as T
  }

  renderInputs() {
    return <Fragment></Fragment>
  }

  render() {
    return (
      <Fragment>
        {this.props.value && <div className='Confirmation'>
          <div className='Confirmation-container'>
            {this.renderInputs()}
            <div className='Confirmation-buttons'>
              <div id='Accept' title='Accept' onClick={this.props.onAccept}>
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
