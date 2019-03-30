import React, { Component } from 'react'
import './css/Message.css'

export const Loading = () =>
  <div className='Message'>
    <i className='fas fa-spinner' id='Message-loading-spinner' />
    Loading..
  </div>

export const Error = () =>
  <div className='Message'>
    <i className='fas fa-sad-tear' />
    Something went wrong..
  </div>

export const Unauthorized = () =>
  <div className='Message'>
    <i className='fas fa-fingerprint' />
    Unauthorized
  </div>
