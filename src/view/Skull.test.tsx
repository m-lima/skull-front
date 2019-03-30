import React from 'react'
import ReactDOM from 'react-dom'
import Skull from './Skull'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Skull />, div)
  ReactDOM.unmountComponentAtNode(div)
})
