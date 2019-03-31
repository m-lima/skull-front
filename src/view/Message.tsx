import React, { Component } from 'react'
import './css/Message.css'

import * as Config from '../model/Config'
import Access from '../control/Access'
import Icon from './Icon'

export const Loading = () =>
  <div className='Message'>
    <Icon icon='fas fa-spinner' id='Message-loading-spinner' />
    Loading..
  </div>

export const Error = () =>
  <div className='Message'>
    <Icon icon='fas fa-sad-tear' />
    Something went wrong..
    <div className='Message-action' onClick={() => window.location.reload()}>
      Refresh
    </div>
  </div>

export const Unauthorized = () =>
  <div className='Message'>
    <Icon icon='fas fa-fingerprint' />
    Unauthorized
    <div className='Message-action' onClick={Access.logout}>
      Logout
    </div>
  </div>

export const Empty = () =>
  <div className='Message'>
    <Icon icon='fas fa-smile-wink' />
    No skulls found
  </div>
