import React, { Component } from 'react'
import IQuickValue from '../model/IQuickValue'

interface IProps {
  quickValue: IQuickValue
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
