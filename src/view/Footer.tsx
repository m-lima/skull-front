import React, { Component } from 'react'
import './css/Footer.css'

import * as Config from '../model/Config'
import Icon from './Icon'

export default class Footer extends Component {
  render() {
    return (
      <div className='Footer'>
        <div className='Footer-container'>
          <a href={Config.Endpoint.skull} title='Download JSON'>
            <Icon icon='fas fa-file-download'/>
          </a>
          <a href={Config.Path.summary} title='Summary'>
            <Icon icon='fas fa-th-list'/>
          </a>
          <a href={Config.Path.chart} title='Chart'>
            <Icon icon='fas fa-chart-line'/>
          </a>
        </div>
      </div>
    )
  }
}

