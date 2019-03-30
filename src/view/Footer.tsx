import React, { Component } from 'react'
import './css/Footer.css'
import { Icon } from './Icon'
import * as Config from '../model/Config'

export default class Footer extends Component {
  render() {
    return (
      <div className='Footer'>
        <div className='Footer-container'>
          <a href={Config.Endpoint.skull} title='Download JSON'>
            <Icon icon='fas fa-file-download' onClick={() => console.log('YOO!!')}/>
          </a>
          <a href='/chart' title='Go to chart'>
            <Icon icon='fas fa-chart-line' />
          </a>
        </div>
      </div>
    )
  }
}

