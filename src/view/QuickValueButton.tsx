import React, { Component } from 'react'
import QuickValue from '../model/QuickValue'

interface IProps {
  quickValue: QuickValue
}

export default class QuickValueButton extends Component<IProps> {
  render() {
    return (
      <div>
        {this.props.quickValue.type}
      </div>
    )
  }
}
