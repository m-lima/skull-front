import React, { Component } from 'react'
import './css/Confirmation.css'

import { Icon } from './Icon'
import IQuickValue from '../model/IQuickValue'

interface IProps {
  quickValue: IQuickValue
}

export default class Confirmation extends Component {
  render() {
    return (
      <div className='Confirmation'>
        <div className='Confirmation-values'>
          <p>Bepo</p>
          <p>10.5</p>
          <input id='amount' type='number' min={0} step={0.1} value={1.0}></input>
        </div>
        <div className='Confirmation-buttons'>
          <a id='Accept' href='' title='Accept'>
            <Icon icon='fas fa-check'/>
          </a>
          <a id='Cancel' href='/chart' title='Cancel'>
            <Icon icon='fas fa-times'/>
          </a>
        </div>
      </div>
    )
  }
}

